import { messageModel } from "../dao/models/message.model.js";

export async function getChatMessages(req, res) {
    try {
        // Obtener la fecha de hace una hora
        const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
        // Imprimir la fecha de hace una hora en la consola
        console.log(oneHourAgo);
        // Obtener los mensajes del chat con la fecha correspondiente
        const messages = await messageModel.find({ date: { $gt: oneHourAgo } }).lean().exec();
        // Renderiizar chat y mensajes
        res.render("chat", { messages });
    } catch (error) {
        console.log("ERROR DE CONEXION: " + error);
    }
}
