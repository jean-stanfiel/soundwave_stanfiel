const { Cancion, Artista } = require('../models');

exports.listar = async (req, res) => {
  try {
    const canciones = await Cancion.findAll({ include: ['artista'] });
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id, { include: ['artista'] });
    if (!cancion) return res.status(404).json({ error: 'Canción no encontrada' });
    res.json(cancion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { artistaId, ...data } = req.body;
    const artista = await Artista.findByPk(artistaId);
    if (!artista) return res.status(404).json({ error: 'Artista no encontrado' });
    const cancion = await Cancion.create({ ...data, artistaId });
    res.status(201).json(cancion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).json({ error: 'Canción no encontrada' });
    await cancion.update(req.body);
    res.json(cancion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).json({ error: 'Canción no encontrada' });
    await cancion.destroy();
    res.json({ mensaje: 'Canción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// contar reproducciones
exports.reproducir = async (req, res) => {
  try {
    const cancion = await Cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).json({ error: 'Canción no encontrada' });
    cancion.reproducciones += 1;
    await cancion.save();
    res.json({ 
      success: true,
      mensaje: 'Reproducción registrada', 
      reproducciones: cancion.reproducciones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};