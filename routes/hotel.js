const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hotel = require('../models/Hotel');
const Currency = require('../models/Currency');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer'); 

// Configuration Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier temporaire où stocker les fichiers
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage }); // Définir le middleware upload



router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, address, email, phone, pricePerNight, currency } = req.body;
  const userId = req.user.id; // Récupération de l'ID de l'utilisateur connecté via le middleware

  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const selectedCurrency = await Currency.findOne({ name: currency });
    if (!selectedCurrency) {
      return res.status(400).json({ msg: 'Invalid currency selected' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'hotels',
    });

    const newHotel = new Hotel({
      name,
      address,
      email,
      phone,
      pricePerNight,
      currency: selectedCurrency._id,
      image: result.secure_url,
      user: userId, // Association de l'hôtel à l'utilisateur connecté
    });

    const hotel = await newHotel.save();
    res.json(hotel);
  } catch (err) {
    console.error('Detailed error:', err);
    res.status(500).json({ msg: 'Error while adding hotel', error: err.message });
  }
});




// Lister tous les hôtels pour chaque utilisateur connecter 
router.get('/', auth, async (req, res) => {
  try {
    // Récupérez l'ID de l'utilisateur connecté
    const userId = req.user.id;

    // Recherchez les hôtels qui appartiennent à cet utilisateur
    const hotels = await Hotel.find({ user: userId })
      .populate('user', ['name', 'email']) 
      .populate('currency', 'name'); 

    // Optionnel : Ajouter le nom de la devise à chaque hôtel dans la réponse
    const hotelsWithCurrencyName = hotels.map(hotel => ({
      ...hotel._doc,
      currencyName: hotel.currency ? hotel.currency.name : null 
    }));

    res.json(hotelsWithCurrencyName); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;


