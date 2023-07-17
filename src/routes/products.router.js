import { Router } from "express";
import { getAllProducts, renderRealTimeProductsView, getProductById, deleteProductById, createProduct, updateProductById } from "../controllers/products.controller.js";

const router = Router();

// Ruta para obtener todos los productos con límite opcional
router.get("/", getAllProducts);

// Ruta para renderizar una vista de productos en tiempo real
router.get("/view", renderRealTimeProductsView);

// Ruta para obtener un producto por su ID
router.get("/:id", getProductById);

// Ruta para eliminar un producto por su ID
router.delete("/:pid", deleteProductById);

// Ruta para crear un nuevo producto
router.post("/", createProduct);

// Ruta para actualizar un producto por su ID
router.put("/:pid", updateProductById);

export default router;

