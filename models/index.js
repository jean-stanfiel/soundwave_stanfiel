const sequelize = require('../config/database');
const Artista = require('./artista');
const Cancion = require('./cancion');

// Relaciones
Artista.hasMany(Cancion, { foreignKey: 'artistaId', as: 'canciones' });
Cancion.belongsTo(Artista, { foreignKey: 'artistaId', as: 'artista' });

module.exports = {
  sequelize,
  Artista,
  Cancion,
};