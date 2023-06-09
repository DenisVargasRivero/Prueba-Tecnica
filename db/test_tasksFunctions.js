const sqlite3 = require('sqlite3').verbose();
const dbPath = './database.sqlite'; // Ruta al archivo de la base de datos

function CreateTask(db, name, description, userId) {
    return new Promise((resolve, reject) => {
        // Verificar si ya existe una tarea para el userId especificado
        db.get('SELECT * FROM tasks WHERE user_id = ? AND name = ?', [userId, name], (err, row) => {
            if (err) {
                console.error('Error al verificar la existencia de la tarea:', err.message);
                resolve(false);
                return;
            }
            
            if (row) {
                console.log('Ya existe una tarea con el mismo nombre para el usuario especificado.');
                resolve(false);
                return;
            }
            
            // Insertar la nueva tarea en la base de datos
            db.run('INSERT INTO tasks (user_id, name, description) VALUES (?, ?, ?)',
            [userId, name, description], function (err) {
                if (err) {
                    console.error('Error al crear la tarea:', err.message);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    });
}

function UpdateTask(db, name, description, userId, taskId) {
    return new Promise((resolve, reject) => {
        // Verificar si existe una tarea que coincida con el userId y el taskId
        db.get('SELECT * FROM tasks WHERE user_id = ? AND id = ?', [userId, taskId], (err, row) => {
            if (err) {
                console.error('Error al verificar la existencia de la tarea:', err.message);
                resolve(false);
                return;
            }
            
            if (row) {
                // Actualizar la entrada de la base de datos con el nuevo nombre y descripción
                db.run('UPDATE tasks SET name = ?, description = ? WHERE user_id = ? AND id = ?',
                [name, description, userId, taskId], (err) => {
                    if (err) {
                        console.error('Error al actualizar la tarea:', err.message);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
                return;
            }
            
            console.log('No se encontró una tarea con el userId y el taskId especificados.');
            resolve(false);
        });
    });
}

function DeleteTask(db, userId, taskId) {
    return new Promise((resolve, reject) => {
        // Verificar si existe una tarea que coincida con el userId y el taskId
        db.get('SELECT * FROM tasks WHERE user_id = ? AND id = ?', [userId, taskId], (err, row) => {
            if (err) {
                console.error('Error al verificar la existencia de la tarea:', err.message);
                resolve(false);
                return;
            }
            
            if (row) {
                // Eliminar la tarea de la base de datos
                db.run('DELETE FROM tasks WHERE user_id = ? AND id = ?', [userId, taskId], (err) => {
                    if (err) {
                        console.error('Error al eliminar la tarea:', err.message);
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
                return;
            }
            
            console.log('No se encontró una tarea con el userId y el taskId especificados.');
            resolve(false);
        });
    });
}


// Ejemplo de uso de las funciones
function testTaskFunctions() {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error al abrir la base de datos:', err.message);
            return;
        }
        
        // Crear una nueva tarea
        console.log('Datos para CreateTask:');
        console.log('- Nombre: Tarea nueva, Descripción: Descripción de la tarea nueva, ID de usuario: 2');
        CreateTask(db, 'Tarea nueva', 'Descripción de la tarea nueva', 2)
        .then((createResult) => {
            console.log(`Tarea creada?: ${createResult}`);
            
            // Actualizar una tarea existente
            console.log('Datos para UpdateTask:');
            console.log('- Nombre: Nueva tarea, Descripción: Descripción actualizada, ID de usuario: 1, ID de tarea: 3');
            return UpdateTask(db, 'Nueva tarea', 'Descripción actualizada', 1, 3);
        })
        .then((updateResult) => {
            console.log(`Tarea actualizada?: ${updateResult}`);
            
            // Eliminar una tarea existente
            console.log('Datos para DeleteTask:');
            console.log('- ID de usuario: 1, ID de tarea: 2');
            return DeleteTask(db, 1, 2);
        })
        .then((deleteResult) => {
            console.log(`Tarea eliminada?: ${deleteResult}`);
            
            // Consultar todas las tareas registradas
            db.all('SELECT * FROM tasks', (err, rows) => {
                if (err) {
                    console.error('Error al consultar las tareas:', err.message);
                    return;
                }
                console.log('Todas las tareas registradas:');
                console.log(rows);
            });
            
            db.close();
        })
        .catch((error) => {
            console.error(error);
            db.close();
        });
    });
}

testTaskFunctions();
