const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email Inválido'] 
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee', 'donor'], required: true },
    phoneNumber: { type: String, required: false},
    address: { type: String, required: false},
    country: { type: String, required: true},
    points: { type: Number, default: 0 },
    dateOfBirthday: { 
        type: Date, 
        required: false,
        validate: {
            validator: function(value) {
                return !value || value <= new Date();
            },
            message: 'A data de nascimento não pode ser maior que a data de hoje.'
        }
    },
    profileImage: { type: String, default: null },
    isDeleted: {type: Boolean, default: false},
    created_at: { type: Date, default: Date.now, required: true },

    // para recuperação de passwords
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema, 'users');
