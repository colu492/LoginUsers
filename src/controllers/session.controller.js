import passport from "passport";
import { JWT_COOKIE_NAME } from "../utils.js";
import UserDTO from '../dtos/UserDTO.js';

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
