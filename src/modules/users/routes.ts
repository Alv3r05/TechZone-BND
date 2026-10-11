import { Router, Request, Response, NextFunction } from 'express';
import ctrl from './controller';
import auth from '../../middleware/auth';

const router = Router();

function checkOwn(req: Request, _res: Response, next: NextFunction): void {
    try {
        auth.check.own(req, req.params.id as string);
        next();
    } catch (err) {
        next(err);
    }
}

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User management
 *   - name: Auth
 *     description: Authentication
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', ctrl.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User found }
 *       404: { description: User not found }
 */
router.get('/:id', ctrl.getById);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201: { description: User created }
 *       400: { description: Missing required fields }
 *       409: { description: Duplicate username or email }
 */
router.post('/', ctrl.register);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate a user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', ctrl.login);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user (owner only)
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
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200: { description: User updated }
 *       401: { description: Token required or invalid }
 *       403: { description: You are not the owner }
 *       404: { description: User not found }
 *       409: { description: Duplicate username or email }
 */
router.put('/:id', checkOwn, ctrl.update);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User deleted }
 *       401: { description: Token required or invalid }
 *       403: { description: You are not the owner }
 *       404: { description: User not found }
 */
router.delete('/:id', checkOwn, ctrl.remove);

export default router;
