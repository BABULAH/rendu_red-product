require('dotenv').config(); // Charge les variables d'environnement

const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const hotelRoutes = require('./routes/hotel');
const acceuilRoutes = require('./routes/acceuil');
const auth = require('./middleware/auth'); 
const cors = require('cors');
// Dans app.js ou server.js
const currenciesRoute = require('./routes/currency');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passwordRoutes = require('./routes/password');


// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware pour permettre les requêtes CORS
    app.use(cors({ origin: 'https://la-solution-front.onrender.com' }));
// app.use(cors({ origin: 'http://localhost:3000' }));

// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', hotelRoutes);  
app.use('/api/acceuil', acceuilRoutes);  
app.use('/api/currency', currenciesRoute);
app.use('/api', passwordRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Serveur exécuté sur le port ${PORT}`));
