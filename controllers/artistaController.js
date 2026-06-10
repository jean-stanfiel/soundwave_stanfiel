const { Artista, Cancion } = require('../models');

exports.listar = async (req, res) => {
  try {
    const artistas = await Artista.findAll({
      include: [{ model: Cancion, as: 'canciones' }],
    });
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id, {
      include: [{ model: Cancion, as: 'canciones' }],
    });
    if (!artista) return res.status(404).json({ error: 'Artista no encontrado' });
    res.json(artista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const artista = await Artista.create(req.body);
    res.status(201).json(artista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).json({ error: 'Artista no encontrado' });
    await artista.update(req.body);
    res.json(artista);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).json({ error: 'Artista no encontrado' });
    await artista.destroy();
    res.json({ mensaje: 'Artista eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};