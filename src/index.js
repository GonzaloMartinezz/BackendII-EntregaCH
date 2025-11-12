// src/index.js
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser'; 
import initializePassport from './config/passport.config.js';
import userRouter from './routes/users.router.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ¡FUNDAMENTAL para leer cookies!

// Inicializar Passport
initializePassport(); 
app.use(passport.initialize());

// Conexión a Mongoose (usando la variable de .env)
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Rutas
app.use('/api/sessions', userRouter); // ¡El prefijo que pide la consigna!

app.get('/', (req, res) => {
    res.send('Entrega 1 - Backend - Gonzalo Martinez');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});