import prisma from "../../db/prisma";

export type OrderRow = NonNullable<
    Awaited<ReturnType<typeof prisma.orders.findUnique>>
>;

export interface OrderItemRow {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
    product_name?: string;
    category?: string | null;
}

export interface PreparedItem {
    product_id: number;
    quantity: number;
    price_at_purchase: number;
    product_name: string;
    category: string | null;
}

export interface UpdateItemInput {
    id: number;
    quantity: number;
}

export interface CreateItemInput {
    product_id: number;
    quantity: number;
}

export interface CreateOrderInput {
    items: CreateItemInput[];
}

export type OrderWithItems = OrderRow & { items: OrderItemRow[] };
