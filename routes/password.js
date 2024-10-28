

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configuration de Nodemailer pour Mailtrap
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER, // Votre nom d'utilisateur Mailtrap
        pass: process.env.MAILTRAP_PASS, // Votre mot de passe Mailtrap
    },
});

// Fonction d'envoi d'email
const sendResetEmail = (email, resetToken) => {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`; // URL avec token
    const mailOptions = {
        from: 'kebedev313@gmail.com', // Votre adresse d'expéditeur
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `<p>Bonjour,</p>
               <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>Ce lien est valide pendant 15 minutes.</p>`,
    };

    return transporter.sendMail(mailOptions);
};

// Route pour demander un lien de réinitialisation de mot de passe
router.post('/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        // Générer un token de réinitialisation
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Envoyer l'email
        await sendResetEmail(email, resetToken);

        res.json({ message: "Lien de réinitialisation envoyé. Vérifiez votre boîte mail." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Réinitialisation de mot de passe
router.post('/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré" });
        }

        // Hacher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Sauvegarder le nouvel utilisateur
        await user.save();
        res.json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



//Route de deconnexion de l'utilisateur

// Route de déconnexion
router.post('/auth/logout', (req, res) => {
    // Effacez le token stocké côté serveur, ou supprimez les cookies d'authentification
    res.clearCookie('token'); // Suppression du cookie token (si applicable)
    res.status(200).json({ message: 'Déconnexion réussie' });
});



module.exports = router; // Exporte le routeur
