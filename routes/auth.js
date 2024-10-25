const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// clé secrète sécurisée
const JWT_SECRET = 'lI2O6wqrXw2G8l04suKaB4FIljNPjqGd'; 

// Route d'inscription
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Créer un nouvel utilisateur
        user = new User({
            username,
            email,
            password
        });

        // Hacher le mot de passe avant de le sauvegarder
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Sauvegarder l'utilisateur dans la base de données
        await user.save();

        // Générer le token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Envoyer la réponse avec le token et les informations de l'utilisateur
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Envoyer la réponse avec le token et les informations de l'utilisateur
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username, // Assurez-vous que le champ est bien "username"
                email: user.email
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router; // Exporte uniquement le routeur ici



