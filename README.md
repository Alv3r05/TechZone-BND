# TechZone-BND

A practice REST API built with **Node.js**, **Express 5**, **TypeScript**, **Prisma** and **MySQL/MariaDB**.
It includes user registration/login with **JWT + bcrypt**, product management, and order management with stock control inside transactions. API documentation is served through **Swagger UI**.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Running the project](#running-the-project)
- [API documentation](#api-documentation)
- [Available scripts](#available-scripts)
- [API overview](#api-overview)

---

## Features

- User registration and login with hashed passwords (bcrypt) and JWT authentication.
- CRUD for products, restricted so that only the owner can update or delete.
- Order creation with atomic stock decrement inside a Prisma transaction.
- Update / delete of orders that automatically returns the stock to products.
- Centralized error handling middleware.
- OpenAPI 3 documentation with Swagger UI at `/docs`.

## Tech stack

- Node.js + TypeScript
- Express 5
- Prisma 7 with the MariaDB adapter (`@prisma/adapter-mariadb`)
- MySQL / MariaDB
- JSON Web Tokens (`jsonwebtoken`) and `bcrypt`
- `swagger-jsdoc` + `swagger-ui-express`
- `tsx` for local development, `tsc` for production builds

## Project structure

```
prisma/
  schema.prisma          # Prisma schema (users, products, orders, order_items)
src/
  app.ts                 # Express app, middleware and route registration
  server.ts              # HTTP server bootstrap
  config/                # Environment configuration
  db/prisma.ts           # Prisma client instance (MariaDB adapter)
  middleware/
    auth.ts              # JWT sign/verify + ownership checks
    errorHandler.ts      # Global error handler
  modules/
    users/               # Users + auth (controller / service / repository / routes)
    products/            # Products CRUD
    orders/              # Orders CRUD with stock control
  types/express.d.ts     # Express Request augmentation for req.user
  utils/
    error.ts             # AppError helper
    swagger.ts           # Swagger definition
prisma.config.ts         # Prisma config (schema path + datasource url)
tsconfig.json
package.json
```

## Requirements

- **Node.js** 20 or newer (recommended 22+)
- **npm** 10 or newer
- A running **MySQL** instance (local, Docker or managed)
- Git (optional, to clone the repository)

## Installation

1. Clone the repository (or open the folder):

   ```bash
   git clone <your-repo-url>
   cd TechZone-BND
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

Variables used by the application (see [.env.example](.env.example)):

| Variable          | Description                                         | Example                                                        |
| ----------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| `PORT`            | HTTP port the server listens on                     | `3000`                                                         |
| `MYSQL_HOST`      | Database host                                       | `localhost`                                                    |
| `MYSQL_PORT`      | Database port                                       | `3306`                                                         |
| `MYSQL_USER`      | Database user                                       | `root`                                                         |
| `MYSQL_PASSWORD`  | Database password                                   | `secret`                                                       |
| `MYSQL_DATABASE`  | Database name                                       | `practica_node`                                                |
| `DATABASE_URL`    | Prisma connection string (used by the Prisma CLI)   | `mysql://root:secret@localhost:3306/practica_node`             |
| `JWT_SECRET`      | Secret used to sign JSON Web Tokens                 | `a_long_random_string`                                         |
| `JWT_EXPIRES_IN`  | Token expiration (e.g. `1h`, `2d`)                  | `1h`                                                           |

## Database setup

1. Create the database in your MySQL server (only if it does not exist yet):

   ```sql
   CREATE DATABASE practica_node;
   ```

2. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

3. Push the schema to the database (creates tables from `prisma/schema.prisma`):

   ```bash
   npm run init-db
   ```

   Alternatively, if you prefer migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

## Running the project

### Development mode (hot reload with `tsx`)

```bash
npm run dev
```

The server will start at `http://localhost:3000` (or the port defined in `PORT`).

### Production build

```bash
npm run build
npm start
```

`npm run build` compiles TypeScript into `dist/`, and `npm start` runs the compiled server with Node.

## API documentation

Once the server is running, open the interactive Swagger UI in your browser:

```
http://localhost:3000/docs
```

From there you can try every endpoint. For protected endpoints, click **Authorize** and paste the JWT token returned by `POST /users` (register) or `POST /users/login`.

## Available scripts

| Script            | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Start the server in watch mode with `tsx`                        |
| `npm run build`   | Compile TypeScript to `dist/`                                    |
| `npm start`       | Run the compiled server (`node dist/server.js`)                  |
| `npm run init-db` | Sync the Prisma schema with the database (`prisma db push`)      |
| `npm test`        | Run the test suite with `tsx --test` (test file must exist)      |

## API overview

Base URL: `http://localhost:3000`

### Users / Auth

| Method | Endpoint         | Auth  | Description                              |
| ------ | ---------------- | ----- | ---------------------------------------- |
| GET    | `/users`         | —     | List all users                           |
| GET    | `/users/:id`     | —     | Get a user by id                         |
| POST   | `/users`         | —     | Register a new user, returns JWT token   |
| POST   | `/users/login`   | —     | Log in, returns JWT token                |
| PUT    | `/users/:id`     | Owner | Update a user (owner only)               |
| DELETE | `/users/:id`     | Owner | Delete a user (owner only)               |

Registration rules:

- `name` must be at least 15 characters long.
- `username` must be at least 10 characters long and unique.
- `password` must be at least 8 characters long (stored as bcrypt hash).
- `email` must match `@(gmail|hotmail|outlook|yahoo|icloud).(com|es|pe)` and be unique.

### Products

| Method | Endpoint          | Auth   | Description                              |
| ------ | ----------------- | ------ | ---------------------------------------- |
| GET    | `/products`       | —      | List all products                        |
| GET    | `/products/mine`  | Bearer | List products created by the current user |
| GET    | `/products/:id`   | —      | Get a product by id                      |
| POST   | `/products`       | Bearer | Create a new product                     |
| PUT    | `/products/:id`   | Owner  | Update a product (owner only)            |
| DELETE | `/products/:id`   | Owner  | Delete a product (owner only, and no orders reference it) |

### Orders

| Method | Endpoint       | Auth   | Description                                                                 |
| ------ | -------------- | ------ | --------------------------------------------------------------------------- |
| POST   | `/orders`      | Bearer | Create a new order (validates stock, decrements it inside a transaction)    |
| GET    | `/orders`      | Bearer | List the orders of the logged-in user                                       |
| GET    | `/orders/:id`  | Owner  | Get an order with its items                                                 |
| PUT    | `/orders/:id`  | Owner  | Update the item quantities of an order (adjusts stock accordingly)          |
| DELETE | `/orders/:id`  | Owner  | Delete an order and return the stock to the products                        |

### Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Quick example

Register a user:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Perez Long Name",
    "username": "pedroperez01",
    "email": "pedro@gmail.com",
    "password": "supersecret"
  }'
```

Create a product (replace `TOKEN`):

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "MacBook Pro 14\"",
    "description": "Apple M3 Pro, 18GB RAM",
    "price": 2499.99,
    "stock": 10,
    "category": "laptop"
  }'
```

Create an order:

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{ "items": [{ "product_id": 1, "quantity": 2 }] }'
```
