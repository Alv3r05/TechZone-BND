import express from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';

import errorHandler from './middleware/errorHandler';

import usersRoutes from './modules/users/routes';
import productsRoutes from './modules/products/routes';
import ordersRoutes from './modules/orders/routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use(errorHandler);

export default app;
