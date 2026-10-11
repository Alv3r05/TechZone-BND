import { Request, Response, NextFunction } from 'express';
import service from './service';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await service.list());
    } catch (err) {
        next(err);
    }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await service.getById(req.params.id as string));
    } catch (err) {
        next(err);
    }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await service.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await service.login(req.body));
    } catch (err) {
        next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await service.update(req.params.id as string, req.body));
    } catch (err) {
        next(err);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await service.remove(req.params.id as string));
    } catch (err) {
        next(err);
    }
}

export default { list, getById, register, login, update, remove };
