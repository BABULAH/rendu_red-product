const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware d'authentification
const Currency = require('../models/Currency');

// Route POST pour ajouter une devise (protégée par l'authentification)
router.post('/', auth, async (req, res) => {
  const { name, value } = req.body;

  try {
    // Créer une nouvelle devise
    const newCurrency = new Currency({
      name,
      value,
      // user: req.user._id, // Lier la devise à l'utilisateur connecté
    });

    const currency = await newCurrency.save();
    res.json(currency);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route GET pour lister toutes les devises (protégée par l'authentification)
router.get('/', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur lors de la récupération des devises.' });
  }
});

module.exports = router;
