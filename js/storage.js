
(function(global) {
    const DB_KEY = 'GestorTareasDB';

    function initializeDatabase() {
        if (!localStorage.getItem(DB_KEY)) {
            
            const initialData = {
                usuarios: [
                    { id: 1, userName: 'admin_user', password: 'password_admin', rol: 'administrador' },
                    { id: 2, userName: 'juan_perez', password: 'password_juan', rol: 'usuarioNormal' },
                    { id: 3, userName: 'ana_gomez', password: 'password_ana', rol: 'usuarioNormal' }
                ],
                tareas: [
                    { id: 1, titulo: 'Revisar documentación del proyecto', estado: 'Pendiente', fechaCreacion: '2024-05-10', fechaVencimiento: '2024-09-15', idUsuario: 2 },
                    { id: 2, titulo: 'Enviar reporte mensual', estado: 'Completada', fechaCreacion: '2024-05-05', fechaVencimiento: '2024-08-20', idUsuario: 2 },
                    { id: 3, titulo: 'Actualizar CV', estado: 'Pendiente', fechaCreacion: '2024-05-12', fechaVencimiento: '2024-06-30', idUsuario: 3 },
                    { id: 4, titulo: 'Preparar presentación para reunión', estado: 'Pendiente', fechaCreacion: '2024-05-01', fechaVencimiento: '2024-05-25', idUsuario: 1 },
                    { id: 5, titulo: 'Investigar nuevas tecnologías', estado: 'Pendiente', fechaCreacion: '2024-05-15', fechaVencimiento: '2024-10-10', idUsuario: 3 }
                ]
            };
            localStorage.setItem(DB_KEY, JSON.stringify(initialData));
            console.log("Base de datos inicializada en localStorage con datos de ejemplo.");
        } else {
            console.log("Base de datos ya existente en localStorage.");
        }
    }

    function readDatabase() {
        const storedData = localStorage.getItem(DB_KEY);
        return storedData ? JSON.parse(storedData) : { usuarios: [], tareas: [] };
    }

    function writeDatabase(data) { 
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    }

    function getUsers() {
        const db = readDatabase();
        return db.usuarios;
    }

    function getUserByUsername(username) { 
        const users = getUsers();
        return users.find(user => user.userName === username); 
    }

    function addUser(newUser) {
        const db = readDatabase();
        if (db.usuarios.some(user => user.userName === newUser.userName)) { 
            return false;
        }
        const newId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
        const userToAdd = { ...newUser, id: newId };
        db.usuarios.push(userToAdd);
        writeDatabase(db);
        return true;
    }

    function getTasks() {
        const db = readDatabase();
        return db.tareas;
    }

    function getTasksByUserId(userId) {
        const tasks = getTasks();
        return tasks.filter(task => task.idUsuario === userId); 
    }

   
    function addTask(newTask) {
        const db = readDatabase();
        const newId = db.tareas.length > 0 ? Math.max(...db.tareas.map(t => t.id)) + 1 : 1;
        const taskToAdd = { ...newTask, id: newId };
        db.tareas.push(taskToAdd);
        writeDatabase(db);
    }

    function updateTask(taskId, updatedFields) {
        const db = readDatabase(); 
        const taskIndex = db.tareas.findIndex(task => task.id === taskId); 

        if (taskIndex !== -1) {
            db.tareas[taskIndex] = { ...db.tareas[taskIndex], ...updatedFields };
            writeDatabase(db);
        } else {
            console.error(`Tarea con ID ${taskId} no encontrada para actualizar.`); 
        }
    }

    function deleteTask(taskId) {
        const db = readDatabase();
        const initialLength = db.tareas.length;
        db.tareas = db.tareas.filter(task => task.id !== taskId); 

        if (db.tareas.length !== initialLength) {
            writeDatabase(db);
            console.log(`Tarea con ID ${taskId} eliminada.`);
        } else {
            console.error(`Tarea con ID ${taskId} no encontrada para eliminar.`); 
        }
    }

  
    initializeDatabase();

    global.DBManager = {
        getUsers,
        getUserByUsername,
        addUser,
        getTasks,
        getTasksByUserId,
        addTask, 
        updateTask,
        deleteTask
    };

})(window);