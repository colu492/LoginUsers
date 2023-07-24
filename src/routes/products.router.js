import { Router } from "express";
import passport from 'passport';
import { checkAdmin } from '../middelwares/authMiddleware.js'; // Importar el middleware checkAdmin
import { getAllProducts, renderRealTimeProductsView, getProductById, deleteProductById, createProduct, updateProductById } from "../controllers/products.controller.js";

const router = Router();

// Ruta para obtener todos los productos con límite opcional
router.get("/", getAllProducts);

// Ruta para renderizar una vista de productos en tiempo real
router.get("/view", renderRealTimeProductsView);

// Ruta para obtener un producto por su ID
router.get("/:id", getProductById);

// Ruta para eliminar un producto por su ID (solo administrador)
router.delete("/:pid", passport.authenticate('jwt', { session: false }), checkAdmin, deleteProductById);

// Ruta para crear un nuevo producto (solo administrador)
router.post("/", passport.authenticate('jwt', { session: false }), checkAdmin, createProduct);

// Ruta para actualizar un producto por su ID (solo administrador)
router.put("/:pid", passport.authenticate('jwt', { session: false }), checkAdmin, updateProductById);

// Ruta para crear un nuevo producto y asociarlo a un ticket (solo usuarios autenticados)
router.post("/", passport.authenticate("jwt", { session: false }), createProduct);

export default router;


