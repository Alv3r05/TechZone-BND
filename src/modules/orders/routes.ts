import { Router, Request, Response, NextFunction } from 'express';
import ctrl from './controller';
import auth from '../../middleware/auth';

const router = Router();

function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    try {
        auth.check.logged(req);
        next();
    } catch (err) {
        next(err);
    }
}

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Purchase orders
 */

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order with products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201: { description: Order created }
 *       400: { description: Invalid data or insufficient stock }
 *       401: { description: Token required }
 *       409: { description: Stock conflict due to concurrency }
 */
router.post('/', requireAuth, ctrl.create);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: List the orders of the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of orders }
 *       401: { description: Token required }
 */
router.get('/', requireAuth, ctrl.listMine);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get an order with its items (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order found }
 *       401: { description: Token required }
 *       403: { description: You are not the owner }
 *       404: { description: Not found }
 */
router.get('/:id', requireAuth, ctrl.getById);

/**
 * @openapi
 * /orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update the item quantities of an order (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     quantity: { type: integer }
 *     responses:
 *       200: { description: Order updated }
 *       400: { description: Invalid data }
 *       401: { description: Token required }
 *       403: { description: You are not the owner }
 *       404: { description: Order or item not found }
 *       409: { description: Insufficient stock }
 */
router.put('/:id', requireAuth, ctrl.update);

/**
 * @openapi
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order and return stock to the products (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Order deleted }
 *       401: { description: Token required }
 *       403: { description: You are not the owner }
 *       404: { description: Order not found }
 */
router.delete('/:id', requireAuth, ctrl.remove);

export default router;
