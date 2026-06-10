const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cancion = sequelize.define('Cancion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  album: {
    type: DataTypes.STRING,
    defaultValue: 'Single',
  },
  duracion: {
    type: DataTypes.INTEGER,
    comment: 'Duración en segundos',
    validate: {
      min: 10,
      max: 600,
    },
  },
  reproducciones: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  artistaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artistas',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'canciones',
});

module.exports = Cancion;