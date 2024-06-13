const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = new mongoose.Schema({
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
    donationRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationRequest'},
    conditionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Condition' }, // Reference to the scoring rule
    description: {type: String, required: true},
    weight: { type: Number, min: 0, required: true } // em Kg
});

itemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Item', itemSchema, 'items');
