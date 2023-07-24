import Ticket from "../dao/models/ticket.model.js";

// Servicio para obtener todos los tickets
export async function getAllTickets() {
    try {
        const tickets = await Ticket.find();
        return tickets;
    } catch (error) {
        throw new Error("Error al obtener los tickets");
    }
}
