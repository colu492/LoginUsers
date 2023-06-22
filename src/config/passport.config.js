import passport from "passport";
import userModel from "../dao/models/user.model.js";
import local from "passport-local"
import passport_jwt from "passport-jwt";
import { createHash, isValidPassword, generateToken, extractCookie } from "../utils.js";
import { JWT_PRIVATE_KEY } from "../utils.js";

const { ExtractJwt } = passport_jwt;
const LocalStrategy = local.Strategy
const JWTStrategy = passport_jwt.Strategy
const initializePassport =() => {

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
}, async (req, username, password, done) => {

    const {first_name, last_name, email, age } = req.body
    try {
        const user = await userModel.findOne({ email:username })
        if (user) {
            console.log("Usuario existente");
            return done(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Email o contraseña incorrectos' });
        }

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        }
        const result = await userModel.create(newUser)

        return done(null, result);
    } catch (error) {
        return done("[LOCAL] error al obtener usuario" + error);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email'

}, async (username, password, done) => {
    try {
        const user = await userModel.findOne({email: username})
        if(!user) {
            console.log("Usuario inexistente")
            return done(null, user)
        }
        if(!isValidPassword(user, password)) return done (null, false)

        const token = generateToken(user)
        user.token = token

        return done(null, user)
    }catch (error){

    }
}));

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
    secretOrKey: JWT_PRIVATE_KEY
}, async(jwt_payload, done) => {
    done(null, jwt_payload)
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user);
});

}
export default initializePassport;
