// src/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collection = 'Users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts' 
    },
    role: {
        type: String,
        default: 'user'
    }
});

// Hook "pre-save" para hashear la contraseña
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    // Usamos hashSync como pide la consigna
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

// Método para validar la contraseña
userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const userModel = mongoose.model(collection, userSchema);

export default userModel;