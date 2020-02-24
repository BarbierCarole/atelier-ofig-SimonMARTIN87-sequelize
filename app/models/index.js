const Figurine = require('./figurine');
const Review = require('./review');

// un review qui appartient à une figurine
Review.belongsTo( Figurine, {
    foreignKey: "figurine_id",
    as: "figurineId"
});

// une figurine a plusieurs reviews
Figurine.hasMany(Review, {
    foreignKey:"figurine_Id",
    as:"reviews"
});

module.exports = {Figurine, Review};
