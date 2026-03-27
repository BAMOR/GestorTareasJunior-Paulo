(function(global){
    const DB_KEY = 'GestorTareasDB'

function readDatabase() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : null;
}

function writeDatabase(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}


function initializeDatabase() {

    const existingData = readDatabase();

    if (!existingData) {

        const initialData = {
            usuarios: [
                { id: 1, userName: 'admin_user', password: 'password_admin', rol: 'administrador' },
                { id: 2, userName: 'juan_perez', password: 'password_juan', rol: 'usuarioNormal' },
                { id: 3, userName: 'ana_gomez', password: 'password_ana', rol: 'usuarioNormal' },
            ],
            tareas: [
                { id: 1, titulo: 'Revisar documentación', estado: 'Pendiente', fechaCreacion: '2024-05-10', fechaVencimiento: '2024-09-15', idUsuario: 2 }
            ]
        };
        writeDatabase(initialData);
        console.log("Base de datos inicializada por primera vez.");
    } else {
        console.log("Datos cargados desde localStorage correctamente.");
    }
}


// Funciones

function getUsers() {
    const db = readDatabase();
    return db ? db.usuarios : [];
}

function getTasks() {

    const db = readDatabase();
    return db ? db.tareas : [];

}

function saveTask(newTask){
    const db = readDatabase();
    const newId = db.tareas.length > 0 ? Math.max(...db.tareas.map(t=> t.id)) + 1 :1;
    const taskToAdd = {...newTask, id: newId}

    db.tareas.push(taskToAdd);
    writeDatabase(db)
}

initializeDatabase();

global.DBManager = {
        getUsers,
        getTasks,
        saveTask,
        getUserByUsername: (username) => getUsers().find(u => u.userName === username),
        getTasksByUserId: (userId) => getTasks().filter(t => t.idUsuario === userId)
    };

})(window);

