// Toujours commencer par importer les variables d'environnement !
require('dotenv').config();

const express = require('express');
const session = require('express-session');

// on importe le router
const router = require('./app/router');

// un peu de config
const PORT = process.env.PORT || 5000;


const app = express();

// le middleware pour gérer les sessions
app.use( session( {
  secret: "Je suis Bifrost",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: (1000*60*60) // une heure !
  }
}));

// Réglages moteur de rendu ("template engine" ou "view engine" en anglais)
app.set('view engine', 'ejs');
app.set('views', 'app/views');

// servir les fichiers statiques qui sont dans "integration"
app.use(express.static('integration'));

// routage !
app.use(router);

// pour pouvoir récupérer les données en POST, on a besoin de urlencoded
app.use(express.urlencoded({extended: true})); 

// Le middleware pour vérifier le user connecté et transmettre l'info aux views
const userMiddleware = require('./app/middlewares/user');
app.use( userMiddleware );

// on lance le serveur
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
