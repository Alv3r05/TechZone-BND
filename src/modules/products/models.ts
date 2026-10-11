import prisma from "../../db/prisma";

type ProductRecord = NonNullable<
  Awaited<ReturnType<typeof prisma.products.findUnique>>
>;

export type ProductRow = Omit<ProductRecord, "price"> & { price: number };

export interface NewProduct {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  brand: string | null;
  created_by: number;
}

export interface UpdateProduct {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  brand: string | null;
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category?: string | null;
  brand?: string | null;
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  category?: string | null;
  brand?: string | null;
}
