
// 1. Importar express y el motor de plantillas Handlebars
const express = require('express');
const { engine } = require('express-handlebars');

// 2. Importar dotenv para cargar variables de entorno
require('dotenv').config();
const api = require('./routes/api');
const { sequelize, Artista } = require('./models');

// 3. Crear la aplicación Express
const app = express();

// 4. Configurar Handlebars como motor de plantillas
app.engine('.hbs', engine({ extname: '.hbs' }));

// 5. Establecer el motor por defecto
app.set('view engine', '.hbs');

// 6. Middleware para parsear JSON
app.use(express.json());
app.use('/api', api);
app.use(express.urlencoded({ extended: true }));


app.get('/soundwave', async (req, res) => {
    try {
        // 1. Buscamos los artistas (igual que en tu controlador)
        // El { raw: true } es un requisito de Handlebars para dejarte leer los datos
        const artistas = await Artista.findAll({ raw: true });

        // 2. Dibujamos la página y le pasamos los artistas
        res.render('playlist', {
            title: 'SoundWave - Tu música',
            artistas: artistas 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// 7. Ruta para obtener artistas (ejemplo de API)
app.get('/soundwave/artistas', async (req, res) => {
    try {
        const artistas = await Artista.findAll({ raw: true });
        res.json(artistas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener artistas' });
    }
});

// 8. Ruta para crear un nuevo artista (ejemplo de API)
app.post('/soundwave/artistas/agregar', async (req, res) => {
    try {
        const { nombre, genero, pais } = req.body;
        const nuevoArtista = await Artista.create({ nombre, genero, pais });
        res.redirect('/soundwave');
        // res.status(201).json(nuevoArtista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear artista' });
        // res.redirect('/soundwave');
    }
});

// 9. Render de agregar un artista (ejemplo de página)
app.get('/soundwave/artistas/agregar', (req, res) => {
    res.render('agregar', {
        title: 'Agregar Nuevo Artista'
    });
});

// 9. Ruta de agregar una canción a un artista (ejemplo de API)
app.post('/soundwave/artistas/:id/canciones', async (req, res) => {
    try {
        const artistaId = req.params.id;
        const { titulo, duracion } = req.body;
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar canción' });
    }
});

// 8. Iniciar el servidor después de sincronizar la base de datos

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log('Servidor en puerto ' + PORT);
    });
});