const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const conditionSchema = new mongoose.Schema({
    condition: { type: String, required: true }, // Condição do item (ex: "Novo", "Usado", etc.)
    pointsPerKg: { type: Number, min: 1, max: 1000, required: true }, // Pontos por Kilograma baseado na condição do item
    isDeleted: { type: Boolean, default: false }
});


module.exports = mongoose.model('Condition', conditionSchema, 'conditions');