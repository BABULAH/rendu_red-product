const multer = require('multer');

// Configuration de Multer pour stocker les fichiers temporairement
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier temporaire où stocker les fichiers
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nom unique pour chaque fichier
  }
});

// Middleware Multer pour télécharger un seul fichier
const upload = multer({ storage });
