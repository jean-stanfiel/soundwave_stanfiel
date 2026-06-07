const { Artista, Cancion } = require('../models');

// GET /api/artistas -> lista todos
exports.listar = async (req, res) => {
const artistas = await Artista.findAll();
res.json(artistas);
};

// GET /api/artistas/:id -> uno con sus canciones
exports.obtener = async (req, res) => {
const artista = await Artista.findByPk(req.params.id, { include: Cancion });
if (!artista) return res.status(404).json({ error: 'No encontrado' });
res.json(artista);
};

// POST /api/artistas -> crea
exports.crear = async (req, res) => {
const artista = await Artista.create(req.body);
res.status(201).json(artista);
};

// PUT /api/artistas/:id -> actualiza
exports.actualizar = async (req, res) => {
const artista = await Artista.findByPk(req.params.id);
if (!artista) return res.status(404).json({ error: 'No encontrado' });
await artista.update(req.body);
res.json(artista);
};

// DELETE /api/artistas/:id -> elimina
exports.eliminar = async (req, res) => {
const artista = await Artista.findByPk(req.params.id);
if (!artista) return res.status(404).json({ error: 'No encontrado' });
await artista.destroy();
res.json({ mensaje: 'Eliminado' });
};

exports.listarCanciones = async (req, res) => {
const artista = await Artista.findByPk(req.params.id, { include: Cancion });
if (!artista) return res.status(404).json({ error: 'No encontrado' });
res.json(artista.Cancions);
};
