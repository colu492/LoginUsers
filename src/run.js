import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"
import chatRouter from "./routes/chat.router.js"
import {messageModel} from "./dao/models/message.model.js";
import productViewsRouter from './routes/products.views.router.js'
import sessionRouter from './routes/session.router.js'
import { passportCall } from "./utils.js";
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 15;


const run = (socketServer, app) => {
    app.use((req, res, next) => {
        req.io = socketServer
        next()
    })

    app.use("/products", passportCall('jwt') , productViewsRouter)
    app.use("/session", sessionRouter)


    app.use("/api/products", productRouter)
    app.use("/api/carts", cartRouter)
    app.use("/api/chat", chatRouter)


    socketServer.on("connection", socket => {
        console.log("New client connected")
        socket.on("message", async data => {
        await messageModel.create(data)
        let messages = await messageModel.find().lean().exec()
        socketServer.emit("logs", messages)
        })
    })

    app.use("/", (req, res) => res.send("HOME"))

}

export default run