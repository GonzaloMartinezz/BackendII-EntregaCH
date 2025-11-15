import passport from 'passport';
import jwt from 'passport-jwt';
import { userModel } from '../models/user.model';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([CookieExtractor]),
        secretOrKey: process.env.JWT_SECRET ,
    }, 
    async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
    } catch (error) {
            return done(error);
        }
    }));

};
const CookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authCookies'];
    }
    return token;
};

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default initializePassport;