const sequelize = require('../config/database');
const Artista = require('./artista');
const Cancion = require('./cancion');

// Relacion uno a muchos
Artista.hasMany(Cancion, { foreignKey: 'artistaId' });
Cancion.belongsTo(Artista, { foreignKey: 'artistaId' });
module.exports = { sequelize, Artista, Cancion };