import { Ticket, ticketModel } from "../dao/models/ticket.model.js";
import { cartManager } from "../dao/manager/CartManager.js";
import { Product } from "../dao/models/product.model.js";

// Controlador para crear un nuevo ticket
export async function createTicket(req, res) {
    try {
        // Aquí asumimos que ya tenemos la información necesaria para crear el ticket en el cuerpo de la solicitud (req.body).
        const { purchase_datetime, purchaser, products } = req.body;

        // Verificar disponibilidad de stock de todos los productos
        if (!checkProductAvailability(products)) {
            // Si algún producto no tiene suficiente stock, retornamos un error
            return res.status(400).json({ error: "No hay stock disponible para algunos productos" });
        }

        // Calcular el monto total del ticket sumando el precio de cada producto multiplicado por la cantidad comprada
        const amount = calculateTicketAmount(products);

        // Creamos un nuevo ticket utilizando el modelo Ticket
        const newTicket = new Ticket({
            purchase_datetime,
            amount,
            purchaser,
            products,
        });

        // Guardamos el ticket en la base de datos
        await newTicket.save();

        // Obtener el ID del carrito del usuario que realizó la compra
        const cartId = req.user.cartId; // Suponiendo que el ID del carrito está almacenado en el campo "cartId" del usuario

        // Crear el ticket asociado al carrito
        const ticket = await ticketModel.create({
            cartId,
            amount: newTicket.amount, // Asignar el total del ticket
            products: newTicket.products, // Asignar la lista de productos del ticket
        });

        // Actualizar el carrito del usuario después de la compra
        await updateCartAfterPurchase(purchaser, products);

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el ticket" });
    }
}

// Función para verificar la disponibilidad de stock de todos los productos
async function checkProductAvailability(products) {
    for (const product of products) {
        // Verificar si el producto existe en la base de datos y tiene suficiente stock
        const productData = await Product.findById(product.productId); // Obtener los datos del producto desde la base de datos

        if (!productData || productData.stock < product.quantity) {
            return false;
        }
    }
    return true;
}

// Función para calcular el monto total del ticket
function calculateTicketAmount(products) {
    let totalAmount = 0;
    for (const product of products) {
        totalAmount += product.price * product.quantity;
    }
    return totalAmount;
}

// Función para actualizar el carrito del usuario después de la compra
async function updateCartAfterPurchase(purchaser, products) {
    try {
        // Obtener el carrito del usuario
        const userCart = await cartManager.getCartByUser(purchaser);

        // Actualizar el carrito para eliminar los productos comprados y restar las cantidades compradas del stock
        for (const product of products) {
            await cartManager.removeProductFromCart(userCart, product.productId, product.quantity);
            await cartManager.updateProductStock(product.productId, -product.quantity);
        }
    } catch (error) {
        throw new Error("Error al actualizar el carrito del usuario");
    }
}

