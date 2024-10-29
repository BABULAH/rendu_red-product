const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hotel = require('../models/Hotel');
const Currency = require('../models/Currency');
// const cloudinary = require('../utils/cloudinary');
// const multer = require('multer'); // Assurez-vous d'importer Multer correctement



// Lister tous les hôtels
router.get('/',auth ,async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate('user', ['name', 'email']) // Popule le champ user pour récupérer le nom et l'email
      .populate('currency', 'name'); // Ajoute cette ligne pour peupler le champ currency et récupérer le nom de la devise
    
    // Optionnel : Si vous voulez ajouter le nom de la devise à chaque hôtel dans la réponse
    const hotelsWithCurrencyName = hotels.map(hotel => ({
      ...hotel._doc,
      currencyName: hotel.currency ? hotel.currency.name : null // Ajoute le nom de la devise à l'objet de l'hôtel
    }));

    res.json(hotelsWithCurrencyName); // Retourne les hôtels avec les noms de devise
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



module.exports = router;


