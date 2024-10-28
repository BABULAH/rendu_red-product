const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const sgMail = require('@sendgrid/mail');
// const sgMail = require('@sendgrid/mail');

const nodemailer = require('nodemailer');

// dotenv.config();

// Configurer SendGrid avec votre clé API
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
                // email: user.email
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Configuration de Nodemailer pour Mailtrap
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io', // Hôte Mailtrap
    port: 2525, // Port Mailtrap
    auth: {
        user: process.env.MAILTRAP_USER, // Mettez votre username Mailtrap dans .env
        pass: process.env.MAILTRAP_PASS, // Mettez votre password Mailtrap dans .env
    },
});

// Fonction d'envoi de l'email de réinitialisation
const sendResetEmail = (email, resetToken) => {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`; // URL du front avec le token

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

// Route de demande de réinitialisation de mot de passe
router.post('/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        // Générer un token de réinitialisation unique avec expiration
        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

        // Envoyer le token par email
        await sendResetEmail(email, resetToken);

        res.json({ message: "Lien de réinitialisation envoyé. Vérifiez votre boîte mail." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});




//reinitialisation de mot de passe
// router.post('/reset-password', async (req, res) => {
//     const { token, newPassword } = req.body;
//     try {
//         // Vérifier et décoder le token
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const user = await User.findById(decoded.id);
//         if (!user) {
//             return res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré" });
//         }

//         // Hacher le nouveau mot de passe
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(newPassword, salt);

//         // Sauvegarder le nouvel utilisateur
//         await user.save();
//         res.json({ message: "Mot de passe réinitialisé avec succès" });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Erreur serveur' });
//     }
// });



module.exports = router; // Exporte uniquement le routeur ici



