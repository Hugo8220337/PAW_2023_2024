const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const entitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: {
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email Inválido'] 
        },
        phoneNumber: { type: String, required: false },
        address: { type: String, required: false }
    },
    description: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true},
    aditionalInfo: { type: String, required: false },
    isActive: { type: Boolean, default: true }, // Indica se a entidade está ativa ou desativada
    isAccepted: { type: Boolean, default: false }, // Indica se a entidade foi aceita por um administrador ou não
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },


    // para recuperação de passwords
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
});

entitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Entity', entitySchema, 'entities');