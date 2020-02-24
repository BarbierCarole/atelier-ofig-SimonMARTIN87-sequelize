const client = require('./database');

const dataMapper = {

  // méthode qui va chercher toutes les figurines dans la table figurine.
  getAllFigurines: (callback) => {
    // on définit une requete
    const query = `SELECT * FROM "figurine" `;
    // et on la passe,  avec le callback, au client connecté
    client.query(query, callback);
  },

  // méthode qui va chercher une seule figurine dans la table figurine
  getOneFigurine: (id, callback) => {
    // on définit une requete PRÉPARÉE avec un paramètre
    const query = `SELECT * FROM "figurine" WHERE "id" = $1`;
    // on définit la liste des paramètres à passer à la requete
    const values = [id];

    // on envoie le tout au client
    client.query( query, values, callback);
  }

};

module.exports = dataMapper;