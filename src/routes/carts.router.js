import express from "express";
import {
    getAllCarts,
    getCartById,
    createCart,
    deleteProductFromCart,
    addProductToCart,
} from "../controllers/carts.contoller.js";

const router = express.Router();

// Ruta para obtener todos los carritos
router.get("/", getAllCarts);

// Ruta para obtener un carrito por su ID
router.get("/:id", getCartById);

// Ruta para crear un nuevo carrito
router.post("/", createCart);

// Ruta para eliminar un producto de un carrito
router.delete("/:cid/product/:pid", deleteProductFromCart);

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", addProductToCart);

export default router;
