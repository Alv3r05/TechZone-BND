import prisma from "../../db/prisma";
import { ProductRow, NewProduct, UpdateProduct } from "./models";

type ProductRecord = NonNullable<
  Awaited<ReturnType<typeof prisma.products.findUnique>>
>;

function toProductRow(product: ProductRecord): ProductRow {
  return { ...product, price: Number(product.price) };
}

export async function getAll(): Promise<ProductRow[]> {
  const products = await prisma.products.findMany({ orderBy: { id: "desc" } });
  return products.map(toProductRow);
}

export async function getById(id: number | string): Promise<ProductRow | null> {
  const product = await prisma.products.findUnique({ where: { id: Number(id) } });
  return product ? toProductRow(product) : null;
}

export async function getByName(name: string): Promise<ProductRow | null> {
  const product = await prisma.products.findUnique({ where: { name } });
  return product ? toProductRow(product) : null;
}

export async function insert(data: NewProduct): Promise<number> {
  const product = await prisma.products.create({ data });
  return product.id;
}

export async function getByCreatedBy(userId: number): Promise<ProductRow[]> {
  const products = await prisma.products.findMany({
    where: { created_by: userId },
    orderBy: { created_at: "desc" },
  });
  return products.map(toProductRow);
}

export async function update(
  id: number | string,
  data: UpdateProduct,
): Promise<number> {
  const result = await prisma.products.updateMany({
    where: { id: Number(id) },
    data,
  });
  return result.count;
}

export async function remove(id: number | string): Promise<number> {
  const result = await prisma.products.deleteMany({ where: { id: Number(id) } });
  return result.count;
}

export async function decrementStock(
  id: number,
  quantity: number,
): Promise<number> {
  const result = await prisma.products.updateMany({
    where: { id, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } },
  });
  return result.count;
}

export default {
  getAll,
  getById,
  getByName,
  insert,
  getByCreatedBy,
  update,
  remove,
  decrementStock,
};
