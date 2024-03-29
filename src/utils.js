import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import passport from 'passport'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const JWT_COOKIE_NAME = 'coderCookieToken'


export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({user}, JWT_PRIVATE_KEY, { expiresIn: '24h'})
    return token
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

export const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.message : info.toString()});
            req.user = user
            next()
        })(req, res, next)
    }
}
export function checkProductAvailability(products) {
    for (const product of products) {
        if (product.quantity > product.stock) {
            return false; // Si la cantidad vendida es mayor al stock, retorna falso
        }
    }
    return true; // Si todos los productos tienen suficiente stock, retorna verdadero
}
export function isPremiumUser(user) {
    return user.role === 'premium';
}
export const generateAdminToken = () => {
    const adminUser = { id: 'admin123', roles: ['admin'] }; // Datos del usuario administrador
    const token = jwt.sign({ user: adminUser }, JWT_PRIVATE_KEY, { expiresIn: '24h' });
    return token;
};

export default __dirname