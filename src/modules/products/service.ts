import repo from "./repository";
import repoOrder from "../orders/repository";
import error from "../../utils/error";
import {
  ProductRow,
  CreateProductInput,
  UpdateProductInput,
} from "./models";

export async function list(): Promise<ProductRow[]> {
  return repo.getAll();
}

export async function listMine(userId: number): Promise<ProductRow[]> {
  return repo.getByCreatedBy(userId);
}

export async function getById(id: number | string): Promise<ProductRow> {
  const product = await repo.getById(id);
  if (!product) {
    throw error("Product not found", 404);
  }
  return product;
}

export async function create(
  { name, description, price, stock, category, brand }: CreateProductInput,
  userId: number,
): Promise<ProductRow> {
  if (!name || price == null || stock == null) {
    throw error("name, price and stock are required", 400);
  }
  if (price < 0 || (stock != null && stock < 0)) {
    throw error("price and stock cannot be negative", 400);
  }

  if (await repo.getByName(name)) {
    throw error("A product with that name already exists", 409);
  }

  const id = await repo.insert({
    name,
    description: description ?? null,
    price,
    stock,
    category: category ?? null,
    brand: brand ?? null,
    created_by: userId,
  });

  const created = await repo.getById(id);
  if (!created) throw error("Product not found after creation", 500);
  return created;
}

export async function update(
  id: number | string,
  data: UpdateProductInput,
  userId: number,
): Promise<ProductRow> {
  const existing = await repo.getById(id);
  if (!existing) {
    throw error("Product not found", 404);
  }
  if (Number(existing.created_by) !== Number(userId)) {
    throw error("You are not the owner of this product", 403);
  }

  if (data.name && data.name !== existing.name) {
    const byName = await repo.getByName(data.name);
    if (byName && Number(byName.id) !== Number(id)) {
      throw error("A product with that name already exists", 409);
    }
  }

  const merged = {
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    price: data.price ?? existing.price,
    stock: data.stock ?? existing.stock,
    category: data.category ?? existing.category,
    brand: data.brand ?? existing.brand,
  };

  await repo.update(id, merged);
  const updated = await repo.getById(id);
  if (!updated) throw error("Product not found after update", 500);
  return updated;
}

export async function remove(
  id: number | string,
  userId: number,
): Promise<{ message: string }> {
  const existing = await repo.getById(id);
  if (!existing) {
    throw error("Product not found", 404);
  }
  if (Number(existing.created_by) !== Number(userId)) {
    throw error("You are not the owner of this product", 403);
  }
  if (await repoOrder.existsByProductId(Number(id))) {
    throw error(
      "Cannot delete a product that already has associated orders",
      400,
    );
  }

  await repo.remove(id);
  return { message: "Product deleted successfully" };
}

export default { list, listMine, getById, create, update, remove };
