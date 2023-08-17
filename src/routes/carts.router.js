import express from "express";
import {
    getAllCarts,
    getCartById,
    createCart,
    deleteProductFromCart,
    addProductToCart,
    checkoutCart
} from "../controllers/carts.contoller.js";


const router = express.Router();

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener todos los carritos
 *     responses:
 *       200:
 *         description: Lista de carritos
 */
router.get("/", getAllCarts);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Obtener un carrito por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito encontrado
 *       404:
 *         description: Carrito no encontrado
 */
router.get("/:id", getCartById);

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito
 *     responses:
 *       200:
 *         description: Carrito creado exitosamente
 */
router.post("/", createCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Eliminar un producto de un carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.delete("/:cid/product/:pid", deleteProductFromCart);

/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Agregar un producto a un carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID del producto a agregar
 *         schema:
 *           type: string
 *       - in: body
 *         name: body
 *         description: Cantidad del producto a agregar
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: integer
 *               example: 1
 *     responses:
 *       200:
 *         description: Producto agregado exitosamente al carrito
 *       404:
 *         description: Carrito o producto no encontrado
 */
router.post("/:cid/product/:pid", addProductToCart);

/**
 * @swagger
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Finalizar el proceso de compra de un carrito
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         description: ID del carrito
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra finalizada exitosamente
 *       404:
 *         description: Carrito no encontrado
 */
router.post("/:cid/purchase", checkoutCart);

export default router;
