const mongoose = require('mongoose');
require('dotenv').config(); // Charge les variables d'environnement

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI; // Assurez-vous que cette variable d'environnement est correctement chargée
        await mongoose.connect(mongoURI);

        console.log(`MongoDB connected: ${mongoURI}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
