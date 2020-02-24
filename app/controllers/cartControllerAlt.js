// Dans cette version du cartController, on va ajouter directement les données de la BDD dans la session
// Ainsi, à l'affichage, il suffit de passer les infos de la session telles qu'elles !

const dataMapper = require('../dataMapper');

const cartController = {
  // afficher le panier
  cartPage: (request, response) => {
    // tout est déjà dans la session ! 
    // il suffit donc de passer le panier à la view !
    
    // on va juste vérifier que le panier existe
    if (!request.session.cart) {
      request.session.cart = [];
    }

    // et faire les calculs de prix
    let totalHT
    if (request.session.cart.length) {
      totalHT = request.session.cart.map( fig => fig.price * fig.quantity ).reduce( (a,b) => a+b);
    } else {
      totalHT = 0;
    }
    
    const tva = (totalHT*20)/100;
    const totalTTC = totalHT+tva+9.99;


    response.render('panier', {
      goodFigurines: request.session.cart,
      totalHT,
      tva,
      totalTTC
    });

  },

  // méthode pour ajouter une figurine dans le panier
  addToCart: (request, response) => {
    // récupérer le paramètre
    const figurineId = request.params.id;
    // 0 - créer le panier si besoin
    if (!request.session.cart) {
      request.session.cart = [];
    }

    // 1 - vérifier si la figurine est déjà dans le panier
    let existingFig = request.session.cart.find( (fig) => fig.id == figurineId);
    if (existingFig) {
      // si on a trouvé la figurine dans le panier, on augmente suelement la quantité
      existingFig.quantity++;
      // et on repart vers la page "/cart"
      response.redirect('/cart');

    } else {
      // sinon, il faut aller chercher la figurine dans la DB
      dataMapper.getOneFigurine(figurineId, (error, data) => {
        if (error) {
          console.trace(error);
          response.status(500).send(error);
        } else {
          // récupérer la figurine qui nous interesse)
          const figurine = data.rows[0];
          // on ajoute une propriété quantité
          figurine.quantity = 1;
          // on ajoute la figurine dans le panier
          request.session.cart.push(figurine);
          // et on repart vers la page "/cart"
          response.redirect('/cart');
        }
      });
    }

  },

  // méthode pour enlever un objet du panier
  deleteFromCart: (request, response) => {
    // récupérer le paramètre
    const figurineId = request.params.id;

    // récupérer la figurine dans le panier
    let existingFig = request.session.cart.find( (fig) =>  fig.id == figurineId);

    // on décrémente la quantité
    existingFig.quantity --;

    // si la quantité a atteint 0 ou moins, il faut enlever complètement la figurine du panier
    if (existingFig.quantity <= 0) {
      request.session.cart = request.session.cart.filter( (fig) => fig.id != figurineId );
    }
    // et on repart vers la page "/cart"
    response.redirect('/cart');
  }
};

module.exports = cartController;
