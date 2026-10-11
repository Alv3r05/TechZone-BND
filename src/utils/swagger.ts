import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Practica Node API',
            version: '1.0.0',
            description: 'Practice API built with Express, MySQL and JWT',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Pedro' },
                        username: { type: 'string', example: 'pedro01' },
                        email: { type: 'string', example: 'pedro@mail.com' },
                    },
                },
                UserInput: {
                    type: 'object',
                    required: ['name', 'username', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Pedro' },
                        username: { type: 'string', example: 'pedro01' },
                        email: { type: 'string', example: 'pedro@mail.com' },
                        password: { type: 'string', example: '1234' },
                    },
                },
                LoginInput: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'pedro01' },
                        password: { type: 'string', example: '1234' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Error message' },
                    },
                },
                ProductInput: {
                    type: 'object',
                    required: ['name', 'price'],
                    properties: {
                        name: { type: 'string', example: 'MacBook Pro 14"' },
                        description: { type: 'string', example: 'Apple M3 Pro, 18GB RAM' },
                        price: { type: 'number', example: 2499.99 },
                        stock: { type: 'integer', example: 10 },
                        category: { type: 'string', example: 'laptop' },
                    },
                },
                OrderInput: {
                    type: 'object',
                    required: ['items'],
                    properties: {
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['product_id', 'quantity'],
                                properties: {
                                    product_id: { type: 'integer', example: 1 },
                                    quantity: { type: 'integer', example: 2 },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [path.join(__dirname, '../modules/**/routes.ts')],
};

export default swaggerJsdoc(options);
