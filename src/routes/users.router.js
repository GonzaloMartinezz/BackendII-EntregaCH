import { Router } from 'express';
import { userModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Ruta de Registro (POST) ---
// (Necesaria para crear usuarios para probar)
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: 'error', message: 'El email ya está registrado' });
        }
        
        const newUser = new userModel({
            first_name, last_name, email, age,
            password // La contraseña en texto plano
        });

        // El hook 'pre-save' en el modelo se encargará de hashearla
        await newUser.save(); 

        res.status(201).send({ status: 'success', message: 'Usuario registrado exitosamente' });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al registrar el usuario', error: error.message });
    }
});

// --- Ruta de Login (POST) ---
// Esto cumple con "El sistema de login permite a los usuarios autenticarse y genera un token JWT válido" 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ status: 'error', message: 'Email no encontrado' });
        }

        // Usamos el método de instancia que creamos en el modelo
        if (!user.comparePassword(password)) {
            return res.status(401).send({ status: 'error', message: 'Contraseña incorrecta' });
        }

        // Si es válido, creamos el payload del token (sin datos sensibles)
        const userPayload = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };

        // Generamos el Token JWT
        const token = jwt.sign({ user: userPayload }, JWT_SECRET, { expiresIn: '1h' });

        // Enviamos el token en una cookie
        res.cookie('jwtCookie', token, {
            httpOnly: true, // No accesible por JS
            secure: false,  // (Poner 'true' en producción con HTTPS)
            maxAge: 3600000 // 1 hora
        }).send({ status: 'success', message: 'Login exitoso', payload: userPayload });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});

// --- Ruta Current (GET) ---
// Esto cumple con "Endpoint /api/sessions/current" 
router.get('/current', 
    // Middleware de Passport: usa la estrategia 'current'
    passport.authenticate('current', { session: false }), 
    (req, res) => {
        // Si passport.authenticate() pasa, el usuario está en req.user
        // Esto cumple con "valida al usuario logueado y extrae sus datos" 
        res.send({ status: 'success', payload: req.user });
    }
);

export default router;