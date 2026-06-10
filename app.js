const express = require('express');
const { engine } = require('express-handlebars');
require('dotenv').config();
const path = require('path');

const apiRoutes = require('./routes/api');
const { sequelize, Artista, Cancion } = require('./models');

const app = express();

// ==================== HELPERS PERSONALIZADOS ====================
const helpers = {
    // Formatear fecha
    formatDate: (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Formatear duración (segundos -> MM:SS)
    formatDuracion: (segundos) => {
        if (!segundos && segundos !== 0) return '0:00';
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos}:${segs.toString().padStart(2, '0')}`;
    },
    
    // Comparar si dos valores son iguales
    eq: (a, b) => a === b,
    
    // Sumar dos números
    sum: (a, b) => a + b,
    
    // Restar dos números
    subtract: (a, b) => a - b
};

// Configuración de Handlebars
app.engine('.hbs', engine({ 
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: helpers
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// ==================== FRONTEND ROUTES ====================

// Home - Lista de artistas
app.get('/soundwave', async (req, res) => {
    try {
        const artistas = await Artista.findAll({ raw: true });
        res.render('playlist', { title: 'Inicio', artistas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});

// Formulario agregar artista
app.get('/soundwave/artistas/agregar', (req, res) => {
    res.render('agregar-artista', { title: 'Agregar Artista' });
});

// Procesar agregar artista
app.post('/soundwave/artistas/agregar', async (req, res) => {
    try {
        await Artista.create(req.body);
        res.redirect('/soundwave');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear artista');
    }
});

// Detalle de artista + canciones
app.get('/soundwave/artistas/:id', async (req, res) => {
    try {
        const artista = await Artista.findByPk(req.params.id, {
            include: [{ model: Cancion, as: 'canciones' }],
        });
        if (!artista) return res.status(404).send('Artista no encontrado');
        res.render('artista-detalle', { 
            title: artista.nombre, 
            artista: artista.toJSON() 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});

// Formulario editar artista
app.get('/soundwave/artistas/editar/:id', async (req, res) => {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).send('Artista no encontrado');
    res.render('editar-artista', { title: 'Editar Artista', artista: artista.toJSON() });
});

// Procesar editar artista
app.post('/soundwave/artistas/editar/:id', async (req, res) => {
    try {
        const artista = await Artista.findByPk(req.params.id);
        if (!artista) return res.status(404).send('Artista no encontrado');
        await artista.update(req.body);
        res.redirect('/soundwave');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar artista');
    }
});

// Formulario agregar canción
app.get('/soundwave/artistas/:id/canciones/agregar', async (req, res) => {
    const artista = await Artista.findByPk(req.params.id);
    if (!artista) return res.status(404).send('Artista no encontrado');
    res.render('agregar-cancion', { title: 'Agregar Canción', artista: artista.toJSON() });
});

// Procesar agregar canción
app.post('/soundwave/artistas/:id/canciones', async (req, res) => {
    try {
        await Cancion.create({ ...req.body, artistaId: req.params.id });
        res.redirect(`/soundwave/artistas/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar canción');
    }
});

// Formulario editar canción
app.get('/soundwave/canciones/editar/:id', async (req, res) => {
    try {
        const cancion = await Cancion.findByPk(req.params.id, {
            include: [{ model: Artista, as: 'artista' }]
        });
        if (!cancion) return res.status(404).send('Canción no encontrada');
        res.render('editar-cancion', { 
            title: 'Editar Canción', 
            cancion: cancion.toJSON() 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
});

// Procesar editar canción
app.post('/soundwave/canciones/editar/:id', async (req, res) => {
    try {
        const cancion = await Cancion.findByPk(req.params.id);
        if (!cancion) return res.status(404).send('Canción no encontrada');
        await cancion.update(req.body);
        res.redirect(`/soundwave/artistas/${cancion.artistaId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar canción');
    }
});

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`🎵 SoundWave API corriendo en http://localhost:${PORT}`);
        console.log(`📡 Frontend: http://localhost:${PORT}/soundwave`);
        console.log(`🔌 API REST: http://localhost:${PORT}/api/artistas`);
    });
});