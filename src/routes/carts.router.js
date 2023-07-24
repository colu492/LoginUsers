import express from "express";
import {
    getAllCarts,
    getCartById,
    createCart,
    deleteProductFromCart,
    addProductToCart,
} from "../controllers/carts.contoller.js";
import { CartManager } from "../dao/manager/CartManager.js";
import { ProductManager } from "../dao/manager/ProductManager.js";
import { IndexServices } from "../services/indexService.js";

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

// Ruta para finalizar el proceso de compra de un carrito
router.post("/:cid/purchase", async (req, res) => {
    try {
        const { cid } = req.params;

        // Verificar si el carrito existe y pertenece al usuario autenticado
        const cart = await CartManager.getCartById(cid);
        if (!cart || cart.userId !== req.user.id) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Obtener los productos del carrito
        const cartProducts = cart.products;

        // Arreglo para almacenar los ids de los productos que no pudieron procesarse
        const notProcessedProducts = [];

        // Recorrer los productos del carrito
        for (const cartProduct of cartProducts) {
            // Obtener el producto desde la base de datos
            const product = await ProductManager.getProductById(cartProduct.productId);

            if (!product) {
                // El producto no existe en la base de datos
                notProcessedProducts.push(cartProduct.productId);
            } else if (product.stock >= cartProduct.quantity) {
                // El producto tiene suficiente stock para la cantidad indicada en el carrito
                // Restar la cantidad comprada del stock del producto
                await ProductManager.updateProductStock(cartProduct.productId, -cartProduct.quantity);
            } else {
                // El producto no tiene suficiente stock para la cantidad indicada en el carrito
                notProcessedProducts.push(cartProduct.productId);
            }
        }

        // Filtrar los productos que no se pudieron comprar y actualizar el carrito
        const remainingProducts = cartProducts.filter((cartProduct) =>
            !notProcessedProducts.includes(cartProduct.productId)
        );

        // Actualizar el carrito con los productos restantes
        await CartManager.updateCartProducts(cart.id, remainingProducts);

        // Generar el ticket con los datos de la compra
        const ticketData = {
            purchase_datetime: new Date(),
            purchaser: req.user.email,
            products: remainingProducts,
        };

        // Crear el ticket utilizando el servicio de Tickets
        const ticket = await IndexServices.createTicket(ticketData);

        // Devolver el arreglo con los ids de los productos que no pudieron procesarse
        res.status(200).json({ notProcessedProducts, ticket });
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        res.status(500).json({ error: "Error al finalizar la compra. Por favor, inténtelo de nuevo más tarde." });
    }
});

export default router;
