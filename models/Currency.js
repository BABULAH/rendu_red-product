const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Associer chaque devise à un utilisateur
  // }
});

module.exports = mongoose.model('Currency', CurrencySchema);
