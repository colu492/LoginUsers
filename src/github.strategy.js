import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import userModel from './dao/models/user.model.js';

const githubStrategy = (clientId, clientSecret, callbackURL) => {
    passport.use(
        new GitHubStrategy(
            {
                clientID: clientId,
                clientSecret: clientSecret,
                callbackURL: callbackURL
            },
            async (_, __, profile, done) => {
                try {
                    const { id, login, displayName, email } = profile;
                    const existingUser = await userModel.findOne({ 'github.id': id });

                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const newUser = new userModel({
                        first_name: displayName,
                        email: email || `${login}@github.com`,
                        'github.id': id,
                        'github.username': login
                    });

                    await newUser.save();
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

export default githubStrategy;
