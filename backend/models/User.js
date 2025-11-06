const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    reservations: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;