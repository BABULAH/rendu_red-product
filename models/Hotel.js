const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: true }, // Référence à la table Currency
    image: { type: String, required: true },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', HotelSchema);
module.exports = Hotel;


