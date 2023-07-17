import { Router } from "express";
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

const router = Router();

router.get('/register', renderRegister);
router.post('/register', registerUser, handleFailedRegister);
router.get('/failregister', handleFailedRegister);

router.get('/login', renderLogin);
router.post('/login', loginUser, handleLoginResult);
router.get('/faillogin', handleFailedLogin);

router.get('/logout', handleLogout);

export default router;
