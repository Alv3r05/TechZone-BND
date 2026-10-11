import repo from './repository';
import productsRepo from '../products/repository';
import error from '../../utils/error';
import {
    OrderRow,
    OrderItemRow,
    PreparedItem,
    UpdateItemInput,
    CreateOrderInput,
    OrderWithItems,
} from './models';

export async function create(input: CreateOrderInput, userId: number): Promise<OrderWithItems> {
    const items = input?.items;
    if (!Array.isArray(items) || items.length === 0) {
        throw error('Order must have at least one product', 400);
    }

    const preparedItems: PreparedItem[] = [];

    for (const it of items) {
        if (!it.product_id || !it.quantity || it.quantity <= 0) {
            throw error('Each item requires product_id and quantity > 0', 400);
        }

        const product = await productsRepo.getById(it.product_id);
        if (!product) {
            throw error(`Product ${it.product_id} not found`, 404);
        }
        if (product.stock < it.quantity) {
            throw error(`Insufficient stock for "${product.name}"`, 400);
        }

        preparedItems.push({
            product_id: it.product_id,
            quantity: it.quantity,
            price_at_purchase: Number(product.price),
            product_name: product.name,
            category: product.category,
        });
    }

    return repo.create({
        user_id: userId,
        items: preparedItems,
    });
}

export async function listMine(userId: number): Promise<OrderRow[]> {
    return repo.getByUser(userId);
}

export async function getById(id: number | string, userId: number): Promise<OrderWithItems> {
    const order = await repo.getById(id);
    if (!order) {
        throw error('Order not found', 404);
    }
    if (Number(order.user_id) !== Number(userId)) {
        throw error('You cannot view orders from another user', 403);
    }

    const items = await repo.getItems(id);
    return { ...order, items } as OrderWithItems;
}

export async function update(
    id: number | string,
    data: { items?: UpdateItemInput[] } | undefined,
    userId: number
): Promise<OrderWithItems> {
    const order = await repo.getById(id);
    if (!order) {
        throw error('Order not found', 404);
    }
    if (Number(order.user_id) !== Number(userId)) {
        throw error('You cannot modify orders from another user', 403);
    }

    const items = data?.items;

    if (!Array.isArray(items) || items.length === 0) {
        throw error('items must be an array with at least one item', 400);
    }
    for (const it of items) {
        if (!it.id || !it.quantity || it.quantity <= 0) {
            throw error('Each item requires id and quantity > 0', 400);
        }
    }

    await repo.update(id, { items });
    return getById(id, userId);
}

export async function remove(id: number | string, userId: number): Promise<{ message: string }> {
    const order = await repo.getById(id);
    if (!order) {
        throw error('Order not found', 404);
    }
    if (Number(order.user_id) !== Number(userId)) {
        throw error('You cannot delete orders from another user', 403);
    }

    await repo.remove(id);
    return { message: 'Order deleted successfully' };
}

export default { create, listMine, getById, update, remove };
