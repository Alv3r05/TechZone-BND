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
 *   - name: Products
 *     description: Technology products
 */

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List all products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', ctrl.list);

router.get("/mine", requireAuth, ctrl.listMine);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Product found }
 *       404: { description: Not found }
 */
router.get('/:id', ctrl.getById);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Register a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201: { description: Product created }
 *       400: { description: Invalid data }
 *       401: { description: Token required }
 *       409: { description: Duplicate name }
 */
router.post('/', requireAuth, ctrl.create);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product (owner only)
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200: { description: Product updated }
 *       401: { description: Token required }
 *       403: { description: You are not the owner }
 *       404: { description: Not found }
 *       409: { description: Duplicate name }
 */
router.put('/:id', requireAuth, ctrl.update);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       400: { description: Product already has associated orders }
 *       401: { description: Token required }
 *       403: { description: You are not the owner }
 *       404: { description: Not found }
 */
router.delete('/:id', requireAuth, ctrl.remove);

export default router;
