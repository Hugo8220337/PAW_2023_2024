const Donation = require("./donation");
const Item = require("./item");
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const donationRequestSchema = new mongoose.Schema({
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
    numberOfItems: { type: Number, require: true },
    expectedPoints: { type: Number, min: 0, require: true },
    status: { type: String, enum: ['Pendente', 'Aceite', 'Rejeitado'], default: 'Pendente' }, // Estado do pedido de doação
    created_at: { type: Date, default: Date.now, required: true },
});

/**
 * Middleware que antes de uma operação (pre), vai verificar se o status mudou para aceite,
 * se sim, vai criar uma doação com status entregue, e vai adicionar o id da doação nos items
 * do pedido da doação
*/
donationRequestSchema.pre('save', async function (next) {
    if (this.isModified('status') && this.status === 'Aceite') {
        // cria uma nova doação
        const donation = new Donation({
            donorId: this.donorId,
            entityId: this.entityId,
            numberOfItems: this.numberOfItems,
            donationRequestId: this._id,
            status: 'Entregue'
        });
        
        await donation.save();

        // Atualizar itens para fazer referência à nova Doação
        await Item.updateMany({ donationRequestId: this._id }, { donationId: donation._id });
    }
    next();
});

donationRequestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('DonationRequest', donationRequestSchema, 'donationRequests');