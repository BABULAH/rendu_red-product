require('dotenv').config(); // Charge les variables d'environnement

const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const hotelRoutes = require('./routes/hotel');
const auth = require('./middleware/auth'); 
const cors = require('cors');
// Dans app.js ou server.js
const currenciesRoute = require('./routes/currency');




const app = express();

// Middleware pour permettre les requêtes CORS
app.use(cors({
    origin: 'http://localhost:3000' // Remplacez par l'URL de votre frontend si nécessaire
  }));


// Vérification de la variable d'environnement MONGO_URI
console.log('Mongo URI:', process.env.MONGO_URI);


// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', require('./routes/hotel'));
app.use('/api/hotels', hotelRoutes);  
app.use('/api/currency', require('./routes/currency')); 

app.use('/api/currency', currenciesRoute);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Serveur exécuté sur le port ${PORT}`));

