import { Request, Response, NextFunction } from "express";
import service from "./service";
import error from "../../utils/error";

export async function list(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json(await service.list());
  } catch (err) {
    next(err);
  }
}

export async function listMine(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw error("Unauthorized", 401);

    const products = await service.listMine(req.user.id);

    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json(await service.getById(req.params.id as string));
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw error("Unauthorized", 401);
    const product = await service.create(req.body, req.user.id);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw error("Unauthorized", 401);
    const product = await service.update(
      req.params.id as string,
      req.body,
      req.user.id,
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw error("Unauthorized", 401);
    res.json(await service.remove(req.params.id as string, req.user.id));
  } catch (err) {
    next(err);
  }
}

export default { list, listMine, getById, create, update, remove };
