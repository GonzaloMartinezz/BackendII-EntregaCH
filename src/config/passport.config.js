import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userModel from '../models/user.model.js';
import { cookieExtractor } from '../utils/utils.js';

const JWT_SECRET = process.env.JWT_SECRET;

const initializePassport = () => {

    /**
     * Estrategia JWT (la llamaremos 'jwt').
     * Esta es la "Estrategia Current" que pide la consigna.
     */
    passport.use('jwt', new JwtStrategy(
        {
            // Extrae el token de la cookie
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: JWT_SECRET
        },
        async (jwt_payload, done) => {
            try {
                // jwt_payload es el contenido del token
                // Buscamos al usuario por su ID
                const user = await userModel.findById(jwt_payload.id).lean();

                if (user) {
                    return done(null, user); // Usuario encontrado, adjunta a req.user
                } else {
                    return done(null, false); // No hay usuario con ese token
                }
            } catch (error) {
                return done(error, false);
            }
        }
    ));
};

export default initializePassport;