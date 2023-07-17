import { ProductManager } from "../dao/ProductManager.js";

const prod = new ProductManager("./src/data/productos.json");

export async function renderRealTimeProducts(req, res) {
    try {
        const products = prod.getProducts();
        res.render("realTimeProducts", { products });
    } catch (err) {
        res.status(400).send(err);
    }
}
