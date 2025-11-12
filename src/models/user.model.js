import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collection = 'Users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts' 
    },
    role: { type: String, default: 'user' }
});

// Hook 'pre-save' para hashear la contraseña
// Esto cumple con "encriptación de la contraseña utilizando bcrypt.hashSync" 
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas (lo usaremos en el login)
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

export const userModel = mongoose.model(collection, userSchema);