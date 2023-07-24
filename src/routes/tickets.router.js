import { Router } from "express";
import { createTicket } from "../controllers/ticket.controller.js";
import { checkUser } from "../middlewares/authMiddleware.js"; // Importar el middleware de autenticación

const router = Router();

// Ruta para crear un nuevo ticket (protegida, solo accesible para usuarios autenticados)
router.post("/create", checkUser, createTicket);

// Ruta para obtener todos los tickets (protegida, solo accesible para usuarios autenticados)
router.get("/all", checkUser, getAllTickets);

export default router;
