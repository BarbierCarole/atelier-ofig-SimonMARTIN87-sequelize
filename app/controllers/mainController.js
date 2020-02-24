const dataMapper = require('../dataMapper');

const mainController = {

  // méthode pour la page d'accueil
  homePage: async (req, res) => {

    try {

      //on va chercher toutes les figurines
      let figurines = await Figurine.findAll({
        include: ["figurineId"]
      });

      res.render('accueil', {
        figurines
      })
    } catch (err) {
      console.trace(err);
      res.status(500).render('500', {err});
    }

  }
  
  
  
  
  
  
  
  /********************************* */
  

  // méthode pour la page article
  articlePage: (request, response) => {
    const figurineId = request.params.id;
    // on appelle dataMapper pour récuérer une figurine par son id
    dataMapper.getOneFigurine( figurineId, (error, data) => {
      if (error) {
        console.trace(error);
        request.status(500).send(error);
      } else {
        // dans data, y'a plein de choses...
        // dans data.rows, j'ai les résultats sous forme de array.
        // mais je veux que le premier !
        const figurine = data.rows[0];

        response.render('article', {
          figurine
        });

      }

    });
    
  }

};


module.exports = mainController;
