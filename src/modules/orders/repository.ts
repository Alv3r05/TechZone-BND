import prisma from '../../db/prisma';
import error from '../../utils/error';
import {
    OrderRow,
    OrderItemRow,
    OrderWithItems,
    PreparedItem,
    UpdateItemInput,
} from './models';

export async function create({
    user_id,
    items,
}: {
    user_id: number;
    items: PreparedItem[];
}): Promise<OrderWithItems> {
    return prisma.$transaction(async (tx) => {
        const order = await tx.orders.create({ data: { user_id } });
        const createdItems: OrderItemRow[] = [];
        for (const it of items) {
            const stockResult = await tx.products.updateMany({
                where: { id: it.product_id, stock: { gte: it.quantity } },
                data: { stock: { decrement: it.quantity } },
            });
            if (stockResult.count === 0) {
                throw error(`Insufficient stock for product ${it.product_id}`, 409);
            }

            const createdItem = await tx.order_items.create({
                data: {
                    order_id: order.id,
                    product_id: it.product_id,
                    quantity: it.quantity,
                    price_at_purchase: it.price_at_purchase,
                },
            });
            createdItems.push({
                id: createdItem.id,
                product_id: createdItem.product_id,
                quantity: createdItem.quantity,
                price_at_purchase: Number(createdItem.price_at_purchase),
                product_name: it.product_name,
                category: it.category,
            });
        }
        return { ...order, items: createdItems };
    });
}

export async function update(
    orderId: number | string,
    { items }: { items: UpdateItemInput[] }
): Promise<void> {
    await prisma.$transaction(async (tx) => {
        for (const it of items) {
            const current = await tx.order_items.findFirst({
                where: { id: it.id, order_id: Number(orderId) },
                select: { product_id: true, quantity: true },
            });
            if (!current) {
                throw error(`Item ${it.id} does not belong to this order`, 404);
            }

            const delta = it.quantity - current.quantity;
            if (delta > 0) {
                const stockResult = await tx.products.updateMany({
                    where: { id: current.product_id, stock: { gte: delta } },
                    data: { stock: { decrement: delta } },
                });
                if (stockResult.count === 0) {
                    throw error(`Insufficient stock for product ${current.product_id}`, 409);
                }
            } else if (delta < 0) {
                await tx.products.update({
                    where: { id: current.product_id },
                    data: { stock: { increment: -delta } },
                });
            }

            await tx.order_items.update({
                where: { id: it.id },
                data: { quantity: it.quantity },
            });
        }
    });
}

export async function remove(orderId: number | string): Promise<void> {
    await prisma.$transaction(async (tx) => {
        const items = await tx.order_items.findMany({
            where: { order_id: Number(orderId) },
            select: { product_id: true, quantity: true },
        });
        for (const it of items) {
            await tx.products.update({
                where: { id: it.product_id },
                data: { stock: { increment: it.quantity } },
            });
        }
        await tx.orders.deleteMany({ where: { id: Number(orderId) } });
    });
}

export async function getByUser(userId: number): Promise<OrderRow[]> {
    return prisma.orders.findMany({
        where: { user_id: userId },
        orderBy: { id: 'desc' },
    });
}

export async function getById(id: number | string): Promise<OrderRow | null> {
    return prisma.orders.findUnique({ where: { id: Number(id) } });
}

export async function getItems(orderId: number | string): Promise<OrderItemRow[]> {
    const items = await prisma.order_items.findMany({
        where: { order_id: Number(orderId) },
        select: {
            id: true,
            product_id: true,
            quantity: true,
            price_at_purchase: true,
            products: { select: { name: true, category: true } },
        },
    });
    return items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: Number(item.price_at_purchase),
        product_name: item.products.name,
        category: item.products.category,
    }));
}

export async function existsByProductId(productId: number): Promise<boolean> {
    const count = await prisma.order_items.count({ where: { product_id: productId } });
    return count > 0;
}

export default {
    create,
    update,
    remove,
    getByUser,
    getById,
    getItems,
    existsByProductId,
};
