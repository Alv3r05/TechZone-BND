export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default function error(message: string, statusCode = 500): AppError {
    return new AppError(message, statusCode);
}
