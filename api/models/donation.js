const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// models
const User = require('../models/user');
const Item = require('../models/item');

// utils
const calculatePoints = require('../utils/itemsPointsCalculator');

const donationSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
    donationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationRequest' },
    numberOfItems: { type: Number, min: 1, require: true},
    pointsGiven: { type: Number, default: 0 },
    status: { type: String, enum: ['Recebido', 'Entregue', 'Perdido'], default: 'Entregue' }, // Estado da doação (delivered significa que foi enviado, mas ainda não foi recebido)
    recieved_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now, required: true }
});

/**
 * Middleware que antes de uma operação (pre), vai verificar se o status mudou para Recebido,
 * se sim, colocar o atributo receiveed_at com a data de hoje, e somar os pontos ao doador
*/
donationSchema.pre('save', async function (next) {
    if (this.isModified('status') && this.status === 'Recebido') {
        
        // encontra os items da doação
        const items = await Item.find({donationId: this._id});

        // calcula os pontos de acordo com os items dela
        const points = await calculatePoints(items);

        // atualiza os pontos dados, e a data onde a doação foi recebida
        this.recieved_at = Date.now();
        this.pointsGiven = points;

        // encontrar doador
        const user = await User.findById(this.donorId);

        // atualiza os pontos se ele ainda existir
        if(user) {
            user.points += points;
        }

        // guarda os pontos
        await user.save();
    }
    
    next();
});

donationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Donation', donationSchema, 'donations');