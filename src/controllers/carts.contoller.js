import { cartModel } from "../dao/models/cart.model.js";
import Ticket from "../dao/models/ticket.model.js";
import userModel from "../dao/models/user.model.js";
import { isPremiumUser } from "../utils.js";

// Obtener todos los carritos
export async function getAllCarts(req, res) {
    try {
        const carts = await cartModel.find().lean().exec();
        res.json({ carts });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Obtener un carrito por su ID
export async function getCartById(req, res) {
    try {
        const id = req.params.id;
        const cart = await cartModel.findOne({ _id: id });
        res.json({ cart });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Crear un nuevo carrito
export async function createCart(req, res) {
    try {
        const newCart = await cartModel.create({});
        res.json({ status: "Success", newCart });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Eliminar un producto de un carrito
export async function deleteProductFromCart(req, res) {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;

        const cart = await cartModel.findById(cartID);
        if (!cart) {
            return res.status(404).json({ status: "error", error: "Cart Not Found" });
        }

        const productIDX = cart.products.findIndex((p) => p.id == productID);

        if (productIDX < 0) {
            return res
                .status(404)
                .json({ status: "error", error: "Product Not Found on Cart" });
        }

        cart.products.splice(productIDX, 1);
        await cart.save();

        res.json({ status: "Success", cart });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Agregar un producto a un carrito
export async function addProductToCart(req, res) {
    try {
        const cartID = req.params.cid;
        const productID = req.params.pid;
        const quantity = req.body.quantity || 1;

        const cart = await cartModel.findById(cartID);

        let found = false;
        for (let i = 0; i < cart.products.length; i++) {
            if (cart.products[i].id == productID) {
                cart.products[i].quantity++;
                found = true;
                break;
            }
        }

        if (!found) {
            cart.products.push({ id: productID, quantity });
        }

        // Obtener el usuario autenticado
        const user = await userModel.findById(req.user._id);

        // Verificar si el usuario es premium y el producto le pertenece
        if (isPremiumUser(user) && cart.owner.toString() === user._id.toString()) {
            return res.status(400).json({ error: "Premium users cannot add their own products to the cart." });
        }

        await cart.save();

        res.json({ status: "Success", cart });
    } catch (error) {
        error = customizeError(1003);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export async function checkoutCart(req, res) {
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

}