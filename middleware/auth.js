// middleware/auth.js
const jwt = require('jsonwebtoken');

// clé secrète sécurisée
const JWT_SECRET = 'lI2O6wqrXw2G8l04suKaB4FIljNPjqGd';

module.exports = (req, res, next) => {
    // Récupérer le token du header d'autorisation
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ message: 'Aucun token, accès refusé' });
    }

    // Vérifier le token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attacher les informations de l'utilisateur à la requête
        next(); // Passer à la prochaine middleware ou route
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide' });
    }
};
