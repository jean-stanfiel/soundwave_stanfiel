const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cancion = sequelize.define('Cancion', {
titulo: { type: DataTypes.STRING, allowNull: false },
album: DataTypes.STRING,
duracion: DataTypes.INTEGER, // en segundos
reproducciones: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Cancion;