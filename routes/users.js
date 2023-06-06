const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

function createNewSessionId(activeSessions){
    const sessionId = uuidv4();
    //Chequeamos que no este duplicado
    if(activeSessions.includes(sessionId))
    return createNewSessionId(activeSessions);
    
    activeSessions.push(sessionId);
    return sessionId;
}

// Función de prueba para imprimir los registros de la tabla users
function printUsers(db) {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Registros de la tabla users:');
            console.log(rows);
        }
    });
}

// Función que devuelve un enrutador de Express que maneja las rutas relacionadas con los usuarios
const usersRouter = (db,activeSessions) => {
    // Endpoint para el registro de usuarios
    router.post('/register', (req, res) => {
        const { username, password } = req.body;
        console.log("Ha llegado una nueva solicitud");
        console.log(req.body);
        if(req.body.username == undefined || req.body.password == undefined){
            res.status(400).json({ result:2, message: 'No se ha recibido ningun dato' });
            return;
        }
        
        // Verificar si el usuario ya existe en la base de datos
        db.get('SELECT * FROM users WHERE name = ?', [username], (err, row) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ result:2, message: 'Error al registrar el usuario', err });
            }

            if (row) {
                // Si el usuario ya existe, enviar una respuesta de error
                console.log("Usuario Existente");
                return res.status(400).json({ result:1, message: 'El usuario ya está registrado' });
            }

            // Insertar el nuevo usuario en la base de datos
            db.run('INSERT INTO users (name, password) VALUES (?, ?)', [username, password], err => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ result:2, message: 'Error al registrar el usuario', err });
                }
                
                console.log(`Registro exitoso!`);
                res.status(200).json({ result:0, message: 'Registro exitoso', sessionId:createNewSessionId(activeSessions) });
                printUsers(db);
            });
        });
    });
    
    // Endpoint para el inicio de sesión
    router.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Buscar el usuario en la base de datos
        db.get('SELECT * FROM users WHERE name = ? AND password = ?', [username, password], (err, row) => {
            if (err || !row)
                return res.status(401).json({ message: 'Credenciales inválidas' });

            console.log(res.body);
            const user = {
                username: row.name, // Suponiendo que el nombre de usuario está almacenado en la columna 'username'
                // Otros datos del usuario que desees devolver
            };
            res.status(200).json({ message: 'Inicio de sesión exitoso', sessionId:createNewSessionId(activeSessions), userName:user.username });
        });
    });

    // Endpoint para cerrar sesión
    router.post('/logout', (req, res) => {
        // Obtener la session ID del cuerpo de la solicitud o de la cookie, dependiendo de cómo estés manejando la sesión en tu aplicación
        const sessionId = req.body.sessionId || req.cookies.session;

        // Verificar si la session ID está en el array de activeSessions
        const sessionIndex = activeSessions.indexOf(sessionId);
        if (sessionIndex !== -1) {
            // Eliminar la session ID del array activeSessions
            activeSessions.splice(sessionIndex, 1);
            return res.status(200).json({ message: 'Sesión cerrada correctamente' });
        }

        res.status(400).json({ message: 'Error al cerrar la sesión' });
    });

    return router;
};

module.exports = usersRouter;
