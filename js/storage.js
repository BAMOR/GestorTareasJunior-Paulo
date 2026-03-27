/**
 * MÓDULO DE ALMACENAMIENTO (storage.js)
 * 
 * Simula una base de datos usando localStorage del navegador.
 * Maneja toda la persistencia de usuarios y tareas.
 * Proporciona funciones CRUD (Crear, Leer, Actualizar, Eliminar).
 */

(function(global) {
    // Clave para guardar los datos en localStorage
    const DB_KEY = 'GestorTareasDB';

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    /**
     * Inicializa la base de datos con datos de ejemplo
     * Solo se ejecuta si no hay datos guardados previamente
     */
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

    // ============================================
    // FUNCIONES BASE (Lectura y Escritura)
    // ============================================

    /** Lee toda la base de datos desde localStorage y la convierte en objeto */
    function readDatabase() {
        const storedData = localStorage.getItem(DB_KEY);
        return storedData ? JSON.parse(storedData) : { usuarios: [], tareas: [] };
    }

    /** Guarda toda la base de datos en localStorage (convierte objeto a texto) */
    function writeDatabase(data) { 
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    }

    // ============================================
    // FUNCIONES PARA USUARIOS
    // ============================================

    /** Obtiene la lista de todos los usuarios */
    function getUsers() {
        const db = readDatabase();
        return db.usuarios;
    }

    /** Busca un usuario por su nombre de usuario */
    function getUserByUsername(username) { 
        const users = getUsers();
        return users.find(user => user.userName === username); 
    }

    /** Agrega un nuevo usuario. Retorna true si se creó, false si ya existe */
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

    /** Elimina un usuario y todas sus tareas asociadas */
    function deleteUser(userId){
        const db = readDatabase();

        const userExist = db.usuarios.some(u=> u.id === userId);
        if(!userExist) return false;

        db.usuarios = db.usuarios.filter(u=> u.id !== userId);
        db.tareas = db.tareas.filter(t=> t.idUsuario !== userId);

        writeDatabase(db);
        return true;
    }

    // ============================================
    // FUNCIONES PARA TAREAS
    // ============================================

    /** Obtiene la lista de todas las tareas */
    function getTasks() {
        const db = readDatabase();
        return db.tareas;
    }

    /** Filtra tareas por ID del usuario asignado */
    function getTasksByUserId(userId) {
        const tasks = getTasks();
        return tasks.filter(task => task.idUsuario === userId); 
    }

    /** Agrega una nueva tarea con ID autoincremental */
    function addTask(newTask) {
        const db = readDatabase();
        const newId = db.tareas.length > 0 ? Math.max(...db.tareas.map(t => t.id)) + 1 : 1;
        const taskToAdd = { ...newTask, id: newId };
        db.tareas.push(taskToAdd);
        writeDatabase(db);
    }

    /** Actualiza campos específicos de una tarea existente */
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

    /** Elimina una tarea por su ID */
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

    // ============================================
    // INICIALIZACIÓN Y EXPORTACIÓN
    // ============================================
  
    initializeDatabase();

    // Exponer funciones al objeto global DBManager
    global.DBManager = {
        getUsers,
        getUserByUsername,
        addUser,
        deleteUser,
        getTasks,
        getTasksByUserId,
        addTask, 
        updateTask,
        deleteTask
    };

})(window);