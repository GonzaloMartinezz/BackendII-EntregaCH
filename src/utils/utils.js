
import jwt from 'jsonwebtoken';

// Clave secreta (leída desde .env)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Genera un token JWT para un usuario.
 */
export const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        cart: user.cart
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h' // El token expira en 1 hora
    });
    return token;
};

/**
 * Extractor de cookies para Passport.
 */
export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookie']; // Mismo nombre que en el login
    }
    return token;
};