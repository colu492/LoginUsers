import passport from "passport";
import bcrypt from "bcryptjs";
import userModel from "../dao/models/user.model.js";
import LocalStrategy from 'passport-local';

const initializePassport =() => {

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await userModel.findOne({ email }).lean().exec();
        if (!user) {
            return done(null, false, { message: 'Email o contraseña incorrectos' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: 'Email o contraseña incorrectos' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id).lean().exec();
        done(null, user);
    } catch (error) {
        done(error);
    }
});
}
export default initializePassport;
