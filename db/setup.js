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
    db.run('DROP TABLE IF EXISTS tasks', (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Tabla tasks eliminada correctamente.');
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

    // Realizar una consulta
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) console.error(err.message);
        console.log(rows);
    });

    // Añadir tareas para cada usuario
    const tasks = [
        // Tareas para Admin
        { user_id: 1, name: 'Hacer compras', description: 'Ir al supermercado y comprar alimentos.' },
        { user_id: 1, name: 'Limpiar la casa', description: 'Realizar la limpieza general de la casa.' },
        { user_id: 1, name: 'Preparar informe', description: 'Elaborar un informe para la reunión de mañana.' },
        { user_id: 1, name: 'Resolver tickets de soporte', description: 'Atender los tickets de soporte de los clientes.' },
        { user_id: 1, name: 'Enviar facturas', description: 'Enviar las facturas a los clientes.' },

        // Tareas para Denis
        { user_id: 3, name: 'Hacer ejercicio', description: 'Realizar una rutina de ejercicios en el gimnasio.' },
        { user_id: 3, name: 'Estudiar programación', description: 'Repasar los conceptos de programación.' },
        { user_id: 3, name: 'Preparar presentación', description: 'Crear una presentación para el proyecto.' },

        // Tarea para Juan
        { user_id: 2, name: 'Llamar al cliente', description: 'Contactar al cliente para discutir los detalles del proyecto.' },
    ];
    const taskStmt = db.prepare('INSERT INTO tasks (user_id, name, description) VALUES (?, ?, ?)');
    tasks.forEach((task) => {
        taskStmt.run(task.user_id, task.name, task.description);
    });
    taskStmt.finalize();

    // Consulta para cada usuario que retorna todas las tareas
    db.all('SELECT * FROM tasks WHERE user_id = ?', [1], (err, rows) => {
        if (err) console.error(err.message);
        console.log('Todas las tareas de Admin:');
        console.log(rows);
    });

    db.all('SELECT * FROM tasks WHERE user_id = ?', [2], (err, rows) => {
        if (err) console.error(err.message);
        console.log('Todas las tareas de Juan:');
        console.log(rows);
    });

    db.all('SELECT * FROM tasks WHERE user_id = ?', [3], (err, rows) => {
        if (err) console.error(err.message);
        console.log('Todas las tareas de Denis:');
        console.log(rows);
    });

    // Consulta para cada usuario que retorna una tarea en particular
    db.get('SELECT * FROM tasks WHERE user_id = ? LIMIT 1', [1], (err, row) => {
        if (err) console.error(err.message);
        console.log('Una tarea de Admin:');
        console.log(row);
    });

    db.get('SELECT * FROM tasks WHERE user_id = ? LIMIT 1', [2], (err, row) => {
        if (err) console.error(err.message);
        console.log('Una tarea de Juan:');
        console.log(row);
    });

    db.get('SELECT * FROM tasks WHERE user_id = ? LIMIT 1', [3], (err, row) => {
        if (err) console.error(err.message);
        console.log('Una tarea de Denis:');
        console.log(row);
    });

    const taskId = [2,3];
    const deleteTasks = db.prepare('DELETE FROM tasks WHERE user_id = ? AND id = ?');
    taskId.forEach((task_Id) => {
        try {
            deleteTasks.run(1, task_Id);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error.message);
        }
    });
    deleteTasks.finalize();

    // Consultar todas las tareas de Admin después de eliminar algunas
    db.all('SELECT * FROM tasks WHERE user_id = ?', [1], (err, rows) => {
        if (err) console.error(err.message);
        console.log('Todas las tareas de Admin después de eliminar algunas:');
        console.log(rows);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Base de datos cerrada correctamente.');
    });
});
