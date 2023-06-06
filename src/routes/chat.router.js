import { Router } from "express";
import { messageModel } from "../dao/models/message.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const onehourago = new Date( Date.now() - 1000 * 60 * 60 );
        console.log(onehourago)
        const messages = await messageModel.find({ date: { $gt: onehourago } }).lean().exec();
        res.render("chat", { messages });
    } catch (error) {
        console.log("ERROR DE CONEXION: " + error);
    }
});

export default router;