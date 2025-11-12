
import { Router } from 'express';
import { userModel } from '../models/user.model.js';

const router = Router();

// --- GET Todos los Usuarios (READ) ---
// Esta es la ruta que SÍ va a responder a /api/users/
router.get('/', async (req, res) => {
    try {
        // Usamos .select('-password') para no exponer las contraseñas
        const users = await userModel.find().select('-password');
        res.send({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al obtener usuarios' });
    }
});

// --- PUT Actualizar Usuario (UPDATE) ---
router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const userToUpdate = req.body;

    if (userToUpdate.password) {
        return res.status(400).send({ status: 'error', message: 'No se puede actualizar la contraseña por esta vía' });
    }

    try {
        const result = await userModel.updateOne({ _id: uid }, userToUpdate);

        if (result.matchedCount === 0) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }

        res.send({ status: 'success', message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al actualizar usuario' });
    }
});

// --- DELETE Eliminar Usuario (DELETE) ---
router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const result = await userModel.deleteOne({ _id: uid });

        if (result.deletedCount === 0) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        
        res.send({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al eliminar usuario' });
    }
});


export default router;