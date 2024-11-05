require('dotenv').config(); // Charge les variables d'environnement

const express = require('express');
const connectDB = require('./config/db');
const hotelRoutes = require('./routes/hotel');
const acceuilRoutes = require('./routes/acceuil');
const auth = require('./middleware/auth');
const cors = require('cors');
const currenciesRoute = require('./routes/currency');
const passwordRoutes = require('./routes/password');

// Charger les variables d'environnement
const app = express();

// Configuration CORS
const corsOptions = {
  origin: 'https://la-solution-front.onrender.com', // Autorise uniquement l'origine du frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Permet l'envoi de cookies et d'informations d'authentification
};

app.use(cors(corsOptions)); // Applique CORS à toutes les routes

// Gérer les requêtes OPTIONS globalement
app.options('*', cors(corsOptions)); 

// Connexion à la base de données
connectDB();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', hotelRoutes);
app.use('/api/acceuil', acceuilRoutes);
app.use('/api/currency', currenciesRoute);
app.use('/api', passwordRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Serveur exécuté sur le port ${PORT}`));
