import { Router } from "express"
import CartManager from "../dao/controllers/CartManager.js"
import {cartModel} from "../dao/models/cart.model.js"

const cartManager = new CartManager("carts.json")
const router = Router()

// Ruta para obtener todos los carritos
router.get("/", async (req, res) => {
    const carts = await cartModel.find().lean().exec()
    res.json({ carts })
})

// Ruta para obtener un carrito por su ID
router.get("/:id", async (req, res) => {
    const id = req.params.id
    const cart = await cartModel.findOne({_id: id})
    res.json({ cart })
})

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
    const newCart = await cartModel.create({})

    res.json({status: "Success", newCart})
})

// Ruta para eliminar un producto de un carrito
router.delete("/:cid/product/:pid", async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid

    const cart = await cartModel.findById(cartID)
    if(!cart) return res.status(404).json({status: "error", error: "Cart Not Found"})

    const productIDX = cart.products.findIndex(p => p.id == productID)
    
    if (productIDX <= 0) return res.status(404).json({status: "error", error: "Product Not Found on Cart"})

    cart.products = cart.products.splice(productIDX, 1)
    await cart.save()
    
    res.json({status: "Success", cart})
})

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartID = req.params.cid
    const productID = req.params.pid
    const quantity= req.body.quantity || 1
    const cart = await cartModel.findById(cartID)

    let found = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].id == productID) {
            cart.products[i].quantity++
            found = true
            break
        }
    }
    if (found == false) {
        cart.products.push({ id: productID, quantity})
    }

    await cart.save()

    res.json({status: "Success", cart})
})

export default router
