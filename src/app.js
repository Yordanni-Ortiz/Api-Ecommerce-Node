const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');
require('dotenv').config();
const path = require('path');
const frontendBuildPath = process.env.FRONTEND_BUILD_PATH

// Esta es nuestra aplicación
const app = express();

// Middlewares
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

/*
CORS BASICO
app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes desde tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));*/

// Lista de orígenes permitidos
const allowedOrigins = [
    `${process.env.BASE_URL_LOCAL}`,
    `${process.env.BASE_URL}`
];

const corsOptions = {
    origin: function(origin, callback) {
        // Permite solicitudes sin origen (por ejemplo, desde herramientas de prueba o backend)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

// Sirve archivos estáticos de la carpeta 'dist' generada por Vite
app.use(express.static(path.join(__dirname, frontendBuildPath)));

// API routes
app.use('/api/v1', router);

// Servir el archivo 'index.html' para la ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, frontendBuildPath, 'index.html'));
});

// Ruta para manejar el restablecimiento de contraseña
app.get('/auth/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, frontendBuildPath, 'index.html'));
});

// middlewares después de las rutas
app.use(errorHandler)

module.exports = app;
