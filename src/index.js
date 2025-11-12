
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import sessionsRouter from './routes/users.router.js';
import dotenv from 'dotenv';
import usersRouter from './routes/sessions.router.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
// Para que el servidor entienda JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Para leer las cookies
app.use(cookieParser());

// --- Configuración de Passport ---
// Llama a la función que configura nuestra estrategia 'current'
initializePassport(); 
app.use(passport.initialize());

// --- Conexión a MongoDB ---
// ¡Aquí conectamos con Mongo DB como pediste!
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// --- Rutas ---
// ¡Aquí cargamos las rutas para Postman!
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);   
 


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


export default app;