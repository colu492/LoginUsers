import express from 'express';
import passport from 'passport';
import { checkUser } from '../middelwares/authMiddleware.js'; // Importar el middleware checkUser
import {
    renderRegister,
    registerUser,
    renderLogin,
    loginUser,
    handleLoginResult,
    handleFailedRegister,
    handleFailedLogin,
    handleLogout
} from "../controllers/session.controller.js";

const router = express.Router();

// Ruta para obtener información del usuario actual (solo usuarios autenticados)
router.get('/current', passport.authenticate('jwt', { session: false }), handleLoginResult);

// Ruta para enviar mensajes al chat (solo usuarios autenticados)
router.post('/chat', passport.authenticate('jwt', { session: false }), checkUser, (req, res) => {

  const message = req.body.message; // Obtener el mensaje del cuerpo de la solicitud

});

// Ruta para agregar productos al carrito (solo usuarios autenticados)
router.post('/cart', passport.authenticate('jwt', { session: false }), checkUser, (req, res) => {

  const productId = req.body.productId; // Obtener el ID del producto del cuerpo de la solicitud
});

// Ruta para cerrar sesión (solo usuarios autenticados)
router.get('/logout', passport.authenticate('jwt', { session: false }), handleLogout);

// Ruta para mostrar el formulario de registro
router.get('/register', renderRegister);

// Ruta para registrar un usuario
router.post('/register', registerUser, handleFailedRegister);

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', renderLogin);

// Ruta para iniciar sesión
router.post('/login', loginUser, handleLoginResult);

// Ruta para mostrar un mensaje de fallo en el registro
router.get('/failregister', handleFailedRegister);

// Ruta para mostrar un mensaje de fallo en el inicio de sesión
router.get('/faillogin', handleFailedLogin);

export default router;


