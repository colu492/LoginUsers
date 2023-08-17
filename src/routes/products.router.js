import { Router } from "express";
import passport from 'passport';
import { checkAdmin } from '../middelwares/authMiddleware.js'; // Importar el middleware checkAdmin
import { getAllProducts, renderRealTimeProductsView, getProductById, deleteProductById, createProduct, updateProductById } from "../controllers/products.controller.js";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/view:
 *   get:
 *     summary: Renderizar vista de productos en tiempo real
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/view", renderRealTimeProductsView);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto por su ID (solo administrador)
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete("/:pid", passport.authenticate('jwt', { session: false }), checkAdmin, deleteProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto (solo administrador)
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *               - stock
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error interno del servidor
 */
router.post("/", passport.authenticate('jwt', { session: false }), checkAdmin, createProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualizar un producto por su ID (solo administrador)
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *               - stock
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error interno del servidor
 */
router.put("/:pid", passport.authenticate('jwt', { session: false }), checkAdmin, updateProductById);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto por su ID (solo administrador)
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: OK
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error interno del servidor
 */
router.post("/", passport.authenticate("jwt", { session: false }), createProduct);

export default router;


