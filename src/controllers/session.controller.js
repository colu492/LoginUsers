import passport from "passport";
import { JWT_COOKIE_NAME } from "../utils.js";

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
    if (!req.user) {
        return res.status(400).send({ status: "error", error: "Invalid credentials" });
    }
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
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
