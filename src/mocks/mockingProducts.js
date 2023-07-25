import express from 'express';

const router = express.Router();

// Array con 100 objetos que representan los productos
const products = [];
for (let i = 1; i <= 100; i++) {
    products.push({
        _id: `product_id_${i}`,
        name: `Product ${i}`,
        description: `This is product number ${i}`,
        price: i * 10,
        stock: 100,
    });
}

// Ruta para el endpoint '/mockingproducts'
router.get('/mockingproducts', (req, res) => {
    res.json(products);
});

export default router;
