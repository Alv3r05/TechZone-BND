import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';

export default function errorHandler(
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({ error: message });
}
