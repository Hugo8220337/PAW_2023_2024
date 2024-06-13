const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true }
});


module.exports = mongoose.model('Store', storeSchema, 'stores');