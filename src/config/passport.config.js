import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { cookieExtractor } from '../utils/utils.js';

import dotenv from 'dotenv';
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;

const initializePassport = () => {

    // Estrategia "current"
    // Esto cumple con "Se ha implementado una estrategia para la autenticación del usuario mediante JWT" 
    // y "Se ha implementado una estrategia 'current'" 
    passport.use('current', new JwtStrategy(
        {
            // Le decimos que extraiga el token desde nuestra función
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: JWT_SECRET
        },
        async (jwt_payload, done) => {
            try {
                // jwt_payload es el objeto { user: { ... } } que guardamos en el token
                if (!jwt_payload.user) {
                    return done(null, false, { message: 'Token inválido.' });
                }
                
                // Si el usuario existe en el payload, lo pasamos
                return done(null, jwt_payload.user);

            } catch (error) {
                return done(error);
            }
        }
    ));

};

export default initializePassport;