const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
const fs = require('fs');

// Lee el archivo .sql
const usersTable = fs.readFileSync('./queries/create_users.sql', 'utf8');

//La funcion Serialize se utiliza para ejecutar consultas de manera Sincrónica.
db.serialize(() => {
    // Eliminar la tabla usuarios si existe
    db.run('DROP TABLE IF EXISTS users', (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Tabla usuarios eliminada correctamente.');
    });
    // Ejecuta las sentencias SQL cargadas desde el archivo
    db.exec(usersTable, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log("Queries ejecutadas correctamente");
    });
    
    // Insertar datos en la tabla con un solo valor
    // db.run('INSERT INTO users (id, name,password) VALUES (?, ?, ?)', [1, 'Admin','123']);
    
    // Insertar múltiples datos utilizando una sola sentencia.
    const defaults = [
        { name: 'Admin', password: '123' },
        { name: 'Juan', password: 'pass123' },
        { name: 'Denis', password: 'yolo123' },
    ];
    const stmt = db.prepare('INSERT INTO users (name, password) VALUES (?, ?)');
    defaults.forEach((usuario) => {
        stmt.run(usuario.name, usuario.password);
    });
    stmt.finalize();
    
    //Eliminar datos de la tabla
    
    // Realizar una consulta
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) console.error(err.message);
        console.log(rows);
    });
    
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Base de datos cerrada correctamente.');
    });
});


