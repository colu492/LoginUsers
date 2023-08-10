import { cartModel } from "../dao/models/cart.model.js";
import Ticket from "../dao/models/ticket.model.js";
import  userModel  from "../dao/models/user.model.js";
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
        const cart = req.user.cart; // Obtener el carrito del usuario desde el objeto de usuario autenticado

        // Eliminar los productos del carrito
        cart.products = [];
        await cart.save();

        // Crear el ticket asociado al carrito
        const ticket = await Ticket.create({
            cartId: cart._id,
            total: totalAmount, // Asignar el total del ticket
            products: products, // Asignar la lista de productos del ticket
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}