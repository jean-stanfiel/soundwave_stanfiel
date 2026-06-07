const express = require('express');
const router = express.Router();
const artistas =
require('../controllers/artistaController');

router.get('/artistas', artistas.listar);
router.get('/artistas/:id', artistas.obtener);
router.post('/artistas', artistas.crear);
router.put('/artistas/:id', artistas.actualizar);
router.delete('/artistas/:id', artistas.eliminar);


module.exports = router;