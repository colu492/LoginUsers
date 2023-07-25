import { productModel } from "../dao/models/product.model.js";
import Ticket from "../dao/models/ticket.model.js";

// Controlador para obtener todos los productos con límite opcional
export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find().lean().exec();
        const limit = req.query.limit || 5;
        
        res.json(products.slice(0, parseInt(limit)));
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

// Controlador para renderizar una vista de productos en tiempo real
export async function renderRealTimeProductsView(req, res) {
    try {
        const products = await productModel.find().lean().exec();
        res.render('realTimeProducts', { data: products });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

// Controlador para obtener un producto por su ID
export async function getProductById(req, res) {
    try {
        const id = req.params.id;
        const product = await productModel.findOne({ _id: id });
        res.json({ product });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

// Controlador para eliminar un producto por su ID
export async function deleteProductById(req, res) {
    try {
        const id = req.params.pid;
        const productDeleted = await productModel.deleteOne({ _id: id });
    
        req.io.emit('updatedProducts', await productModel.find().lean().exec());
        res.json({
            status: "Success",
            message: "Product Deleted!",
            productDeleted
        });
    } catch (error) {
        error = customizeError(1001);
        console.log(error);
        res.json({ error });
    }
}

// Controlador para crear un nuevo producto
export async function createProduct(req, res) {
    try {
        const product = req.body;
        if (!product.title) {
            return res.status(400).json({
                message: "Error: Missing product name"
            });
        }
        const productAdded = await productModel.create(product);
        req.io.emit('updatedProducts', await productModel.find().lean().exec());
        res.json({
            status: "Success",
            productAdded
        });
        // Verificar disponibilidad de stock
        const products = [product]; // Colocamos el producto en un array para usar la función de utilidad
        if (!checkProductAvailability(products)) {
        // Si el stock no es suficiente, retornamos un error
        return res.status(400).json({ error: "Not enough stock for the product" });
        }

        // Restar la cantidad vendida del stock del producto
        product.stock -= product.quantity;
        await product.save();
            if (createdTicketId) {
                product.ticket = createdTicketId;
                await product.save();
            }
        
        // Si el producto fue creado exitosamente y tiene un campo "ticketId",
        // creamos un nuevo ticket y lo asociamos al producto
        if (product.ticketId) {
            const ticket = new Ticket({
                code: generateUniqueCode(), // Generar un código único para el ticket (puedes usar alguna librería como 'uuid' o 'shortid')
                purchase_datetime: new Date(),
                amount: product.price * product.quantity, // Calcular el monto del ticket en función del precio del producto y la cantidad comprada
                purchaser: req.user.email, // Suponiendo que el usuario que realiza la compra está autenticado y su correo está almacenado en req.user.email
                cartId: product.cartId, // Suponiendo que el carrito del usuario está asociado al producto
            });
            await ticket.save();
            product.ticket = ticket._id;
            await product.save();
        }

    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}

// Controlador para actualizar un producto por su ID
export async function updateProductById(req, res) {
    try {
        const id = req.params.pid;
        const productToUpdate = req.body;

        const product = await productModel.updateOne({ _id: id }, productToUpdate);
        req.io.emit('updatedProducts', await productModel.find().lean().exec());
        res.json({
            status: "Success",
            product
        });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}
