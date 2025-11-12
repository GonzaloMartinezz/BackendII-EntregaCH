// src/routes/sessions.router.js

import { Router } from 'express';
import { userModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Ruta de Registro (POST) ---
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: 'error', message: 'El email ya está registrado' });
        }
        
        const newUser = new userModel({
            first_name, last_name, email, age,
            password
        });

        await newUser.save(); 

        res.status(201).send({ status: 'success', message: 'Usuario registrado exitosamente' });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al registrar el usuario', error: error.message });
    }
});


// --- Ruta de Login (POST) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ status: 'error', message: 'Email no encontrado' });
        }

        if (!user.comparePassword(password)) {
            return res.status(401).send({ status: 'error', message: 'Contraseña incorrecta' });
        }

        const userPayload = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };

        const token = jwt.sign({ user: userPayload }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwtCookie', token, {
            httpOnly: true, 
            secure: false,  
            maxAge: 3600000 
        }).send({ status: 'success', message: 'Login exitoso', payload: userPayload });

    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
});


// --- Ruta Current (GET) ---
router.get('/current', 
    passport.authenticate('current', { session: false }), 
    (req, res) => {
        res.send({ status: 'success', payload: req.user });
    }
);



export default router;