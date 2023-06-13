import { Router } from "express";
import bcrypt from 'bcryptjs';
import passport from "passport";
import userModel from "../dao/models/user.model.js";

const router = Router()

router.get('/register', (req, res) => res.render('sessions/register'))

router.post('/register', async (req, res) => {
    const userNew = req.body
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(userNew.password, saltRounds);
        const user = new userModel({
            first_name: userNew.first_name,
            last_name: userNew.last_name,
            email: userNew.email,
            age: userNew.age,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/session/login');
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .render("errors/base", {error: "Error al registrar alumno"});
    }
});

router.get ('/login', (req, res) => res.render('sessions/login'))

router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/session/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/session/login');
});

router.get('/session/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/session/github/callback',
    passport.authenticate('github', { failureRedirect: '/session/login' }),
    (req, res) => {
        res.redirect('/products');
    }
);


// router.post('/login', async (req, res) => {
//     const { email, password } = req.body
//     const user = await userModel.findOne({ email, password}).lean().exec()
//     if (!user) {
//         return res.status(401).render('errors/base', {
//         error: 'Error en email o password'})
//     }
//     req.session.user = user.email
//     res.redirect('/products')
// });
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email }).lean().exec();
//     if (!user) {
//         return res.status(401).render("errors/base", {
//             error: "Error en email o password",
//         });
//     }

//     const paswordMatch = await bcrypt.compare(password, user.password);
//     if (!paswordMatch){
//         return res.status(401).render("errors/base", { error: "Error en email o password"});
//     }
    
//         // Asignar el rol "admin" si el correo coincide con el administrador
//         if (email === "adminCoder@coder.com") {
//         user.role = "admin";
//         } else {
//             user.role = "usuario";
//         }
    
//         req.session.user = user.email;
//         res.redirect("/products");
//     });

export default router;
