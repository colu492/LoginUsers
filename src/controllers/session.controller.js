import passport from "passport";
import { JWT_COOKIE_NAME, generateAdminToken, createHash } from "../utils.js";
import UserDTO from '../dtos/UserDTO.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; 
import  userModel  from '../dao/models/user.model.js';

export function renderRegister(req, res) {
    res.render('sessions/register');
}

export function registerUser(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/session/failregister' })(req, res, next);
}

export function renderLogin(req, res) {
    res.render('sessions/login');
}

export function loginUser(req, res, next) {
    passport.authenticate('login', { failureRedirect: '/session/faillogin' })(req, res, next);
}

export function handleLoginResult(req, res) {
    // Si el inicio de sesión es exitoso, enviamos el DTO del usuario en lugar del objeto completo
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
    }

export function handleFailedRegister(req, res) {
    console.log('Fail Strategy');
    res.send({ error: "Failed" });
}

export function handleFailedLogin(req, res) {
    res.send({ error: "Fail Login" });
}

export function handleLogout(req, res) {
    res.clearCookie(JWT_COOKIE_NAME).redirect('/session/login');
}

// Nueva función para solicitar restablecimiento de contraseña
export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;

        // Buscar el usuario por correo electrónico
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generar un token JWT con expiración de 1 hora
        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

        // Configurar el transportador de nodemailer 
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'jc.diseno.taincol@gmail.com',
                pass: 'tu_contraseña',
            },
        });

        // Definir el enlace de restablecimiento de contraseña
        const resetLink = `http://localhost:8080/session/reset-password/${token}`;

        // Configurar el correo electrónico
        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            text: `Haz click aca para reestablecer tu contrasena: ${resetLink}`,
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

// Función para crear el usuario administrador
async function createAdminUser() {
    try {
        const adminEmail = 'jccolucci.492@gmail.com'; // Correo del administrador
        const adminPassword = 'colu1234'; // Contraseña del administrador

        // Buscar si ya existe un usuario con el correo del administrador
        const existingAdmin = await userModel.findOne({ email: adminEmail });

        if (!existingAdmin) {
            // Crear el usuario administrador en la base de datos
            const adminUser = new userModel({
                email: adminEmail,
                password: createHash(adminPassword), // Asegúrate de tener la función createHash importada
                role: 'admin',
            });

            await adminUser.save();
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

createAdminUser(); // Llamar a la función para crear el usuario administrador al iniciar la aplicación







