const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Accès refusé, aucun token fourni' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Valider le token
    req.user = decoded;
    next(); // Continuer si le token est valide
  } catch (ex) {
    res.status(400).json({ message: 'Token invalide' });
  }
};
