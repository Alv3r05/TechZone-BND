import { Request, Response, NextFunction } from 'express';
import service from './service';
import error from '../../utils/error';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) throw error('Unauthorized', 401);
        const order = await service.create(req.body, req.user.id);
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
}

export async function listMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) throw error('Unauthorized', 401);
        res.json(await service.listMine(req.user.id));
    } catch (err) {
        next(err);
    }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) throw error('Unauthorized', 401);
        res.json(await service.getById(req.params.id as string, req.user.id));
    } catch (err) {
        next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) throw error('Unauthorized', 401);
        res.json(await service.update(req.params.id as string, req.body, req.user.id));
    } catch (err) {
        next(err);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) throw error('Unauthorized', 401);
        res.json(await service.remove(req.params.id as string, req.user.id));
    } catch (err) {
        next(err);
    }
}

export default { create, listMine, getById, update, remove };
