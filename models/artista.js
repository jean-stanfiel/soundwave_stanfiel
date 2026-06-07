const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Artista = sequelize.define('Artista', {
nombre: { type: DataTypes.STRING, allowNull: false },
genero: DataTypes.STRING,
pais: DataTypes.STRING,
});

module.exports = Artista;




