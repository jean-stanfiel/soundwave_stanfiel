const express = require('express');
const router = express.Router();
const artistaController = require('../controllers/artistaController');
const cancionController = require('../controllers/cancionController');

// Artistas
router.get('/artistas', artistaController.listar);
router.get('/artistas/:id', artistaController.obtener);
router.post('/artistas', artistaController.crear);
router.put('/artistas/:id', artistaController.actualizar);
router.delete('/artistas/:id', artistaController.eliminar);

// Canciones
router.get('/canciones', cancionController.listar);
router.get('/canciones/:id', cancionController.obtener);
router.post('/canciones', cancionController.crear);
router.put('/canciones/:id', cancionController.actualizar);
router.delete('/canciones/:id', cancionController.eliminar);
router.post('/canciones/:id/reproducir', cancionController.reproducir);
module.exports = router;