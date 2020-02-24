const dataMapper = require('../dataMapper');

const cartController = {

  // méthode pour afficher le panier
  cartPage: (request, response) => {

    // premier test, anti bug : si pas de panier, on affiche un panier vide
    if (!request.session.cart) {
      return response.render('panier', {
        goodFigurines: [],
        totalHT:0,
        tva:0,
        totalTTC:9.99
      });
    }


    // on veut récupérer les infos du panier (en session - donc request.session.cart)
    // et on veut les passer à la view
    // problème : dans le panier, tout ce qu'on a, c'est des ID...
    // il faut donc qu'on récupère les infos des figurines, dans la BDD, via dataMapper
    dataMapper.getAllFigurines( (error, data) => {
      if (error) {
        console.trace(error);
        response.status(500).send(error);
      } else {
        const allFigurines = data.rows;
        // j'ai d'un côté la liste de toutes les figurines
        // et de l'autre, un objet avec des id et des quantités
        // on va se faire une petite boucle pour fusionner ces infos
        let goodFigurines = []; // on se prévois une variable pour y mettre les bons résultats

        // on parcoure toutes les figurines...
        for (let figurine of allFigurines) {
          // pour chacune on teste si son id est dans le panier
          if (request.session.cart[figurine.id] ) {
            // on "attache" la quantité à l'obet figurine
            figurine.quantity = request.session.cart[figurine.id]; 

            // on ajoute la figurine à la liste des bons résultats
            goodFigurines.push(figurine);
          }
        } 

        // un fois la boucle finie, on peut envoyer la liste des bons résultats à la view
        // mais avant ! on va calculer les tarifs auxiliaires

        // map renvoie un tableau en transformant chq objet. Ici on renvoit à chq fois "prix * quantité"
        const tableauxSousTotaux = goodFigurines.map( (fig) => { return  (fig.price * fig.quantity) } );
        let totalHT = 0;
        // pour chaq sous total, j'ajoute à totalHT
        tableauxSousTotaux.forEach( x => totalHT += x);

        // version moderne top la classe, en utilisant map et reduce
        const newTotalHT = goodFigurines.map( fig => fig.price * fig.quantity ).reduce( (a,b) => a+b);

        const tva = (totalHT*20)/100;
        const totalTTC = totalHT+tva+9.99;

        response.render('panier', {
          goodFigurines,
          totalHT,
          tva,
          totalTTC
        });

      }
    });
    
  },

  // méthode pour ajouter une figurine dans le panier
  addToCart: (request, response) => {
    // pour commencer on va ajouter un objet "cart" dans la session
    // mais UNIQUEMENT si il est pas déjà là !
    if ( !request.session.cart) {
      request.session.cart = {};
    }

    // je récupère mon paramètre
    const figurineId = request.params.id;

    // je vais ajouter un exemplaire de cette figurine dans mon panier :
    if ( request.session.cart[figurineId] ) {
      // si l'id de la figurine est déjà présent dans le panier, j'incrémente le nombre
      request.session.cart[figurineId] ++;
    } else {
      // sinon (l'id de la figurine n'est pas présent), j'en met 1
      request.session.cart[figurineId] = 1;
    }

    // console.log(request.session);

    // on a plus qu'à rediriger vers la page panier
    response.redirect('/cart');

  },

  // méthode pour enlever un objet du panier
  deleteFromCart: (request, response) => {
    // premier test : si y'a pas de panier, y'a rien à faire
    if (!request.session.cart) {
      return response.redirect('/cart');
    }

    // je récupère mon paramètre
    const figurineId = request.params.id;

    // deuxième test : l'objet est-il déjà dans le panier ?
    if (request.session.cart[figurineId]) {
      // si oui, on décrémente
      request.session.cart[figurineId] --;
      // une fois qu'on a décrémenté, il faut vérifier si on a pas "0" quantité de l'objet 
      // ou pire, une quantité négative !
      if (request.session.cart[figurineId] <= 0) {
        // si c'est le cas, on doit supprimer l'id du panier
        delete request.session.cart[figurineId];
      }
    }

    // on redirige vers la page panier
    response.redirect('/cart');

  }


};


module.exports = cartController;
