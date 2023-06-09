require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const usersRouter = require('./routes/users');

// Puerto obtenido de la variable de entorno
const port = process.env.PORT || 3000;
// Crear una instancia de la aplicación Express
const app = express();
// Configurar Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

function printTables(database) {
    database.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error("Error al obtener las tablas:", err.message);
            return;
        }

        console.log("Tablas disponibles:");
        tables.forEach(table => {
            console.log(table.name);
        });
    });
}

let activeSessions = [];
// Conectar a la base de datos SQLite3
const db = new sqlite3.Database('db/database.sqlite', err => {
    if (err) {
        console.error(err.message);
        process.exit(1);
    }
    console.log('Conectado a la base de datos SQLite3');
    // Llamar a la función para imprimir las tablas disponibles
    printTables(db);
});

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
// app.use(bodyParser.json());
// Configurar middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());
// Pasar la instancia de db al enrutador de usuarios
app.use('/users', usersRouter(db, activeSessions));

// Iniciar el servidor
const server = app.listen(port, function() {
    const url = `http://localhost:${server.address().port}`;
    console.log(`Servidor iniciado en: ${url}`);
    exec(`start ${url}`);
});
