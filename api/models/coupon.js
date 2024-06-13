const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    discount: { type: Number, required: true }, // ex: 10%
    isUsed: { type: Boolean, default: false },
    expiryDate: { type: Date, required: true }
});

module.exports = mongoose.model('Coupon', couponSchema, 'coupons');