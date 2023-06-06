import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import path from 'path';
import __dirname from "./utils.js"
//import FileStore from "session-file-store";
import session from 'express-session'
import MongoStore from "connect-mongo"

import { Server } from "socket.io";

import apiProductsRouter from "./routes/apiProducts.router.js";
import productsRouter from "./routes/products.router.js";
import apiCartsRouter from "./routes/apiCarts.router.js";
import cartsRouter from "./routes/carts.router.js";
import indexRouter from "./routes/index.router.js";
import realTimeProductsRouter from "./routes/realTimeProducts.router.js";
import chatRouter from "./routes/chat.router.js";
import { messageModel } from "./dao/models/message.model.js";
import sessionRouter from './routes/session.router.js'
//import initializePassport from "./config/passport.config.js";
//import passport from "passport";

mongoose.set("strictQuery", false);

const __filename = fileURLToPath(import.meta.url);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use(express.static(new URL('../public', import.meta.url).pathname));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/api/products", apiProductsRouter);
app.use("/products", productsRouter);
app.use("/api/carts", apiCartsRouter);
app.use("/carts", cartsRouter);
app.use("/chat", chatRouter);
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://colu492:colu159159@cluster0.fiqaj09.mongodb.net/',
        dbName: 'test',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 120,
    }),
    secret: 'PeMoAr',
    resave: true,
    saveUninitialized: true
}));
app.use('/session', sessionRouter);

// app.use(session({
//     store: MongoStore.create({
//         mongoUrl: ,
//         dbName:
//     }),
//     secret: 'mysecret',
//     resave: true,
//     saveUninitialzed: true

// }))

// initializePassport()
// app.use(passport.initialize())
// app.use(passport.session())

try {
    await mongoose.connect(
        "mongodb+srv://colu492:colu159159@cluster0.fiqaj09.mongodb.net/",
        {
            serverSelectionTimeoutMS: 5000,
        },
    );
    console.log("DB conected");
    const httpServer = app.listen(8080, () => {
        console.log("Server UP");
    });

    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socketClient) => {
        console.log("User conected");
        socketClient.on("deleteProd", (prodId) => {
            const result = prod.deleteProduct(prodId);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto eliminado");
            }
        });
        socketClient.on("addProd", (product) => {
            const producto = JSON.parse(product);
            const result = prod.addProduct(producto);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto agregado");
            }
        });
        socketClient.on("newMessage", async (message) => {
            try {
                console.log(message);
                let newMessage = await messageModel.create({
                    user: message.email.value,
                    message: message.message,
                });
                console.log("app", newMessage);
                socketServer.emit("emitMessage", newMessage);
            } catch (error) {
                console.log(error);
                socketClient.emit("error", error);
            }
        });
    });
} catch (error) {
    console.log(error);
}