const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.sqlite'; // Ruta al archivo de la base de datos

// Conexión a la base de datos
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');

    // Realizar la consulta para obtener todos los usuarios
    const query = 'SELECT * FROM users';

    // Ejecutar la consulta
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        
        // Imprimir los resultados
        rows.forEach((row) => {
            console.log(row);
        });

        // Cerrar la conexión
        db.close((err) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Base de datos cerrada correctamente.');
        });
    });
});
