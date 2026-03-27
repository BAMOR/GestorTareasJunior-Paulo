/**
 * MÓDULO PRINCIPAL (main.js)
 * 
 * Coordina todos los módulos (DBManager, AuthManager, UIManager).
 * Maneja los eventos de la interfaz: login, creación de tareas, logout y gestión de usuarios.
 */

// ============================================
// ELEMENTOS DEL DOM
// ============================================

const loginForm = document.getElementById('loginForm');
const taskForm = document.getElementById('taskForm');
const logoutButton = document.getElementById('logoutButton'); 

// ============================================
// EVENTO: INICIAR SESIÓN
// ============================================

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();  // Evitar que recargue la página

    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    const userLoggedIn = AuthManager.login(username, password);

    if (userLoggedIn) {
        UIManager.showMainSection(userLoggedIn);  // Mostrar pantalla principal
    } else {
        showCustomAlert("Usuario o contraseña incorrectos.", "error");
    }
});

// ============================================
// EVENTO: CREAR NUEVA TAREA
// ============================================

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();  // Evitar que recargue la página

    const title = document.getElementById('taskTitleInput').value.trim();
    const dueDateStr = document.getElementById('taskDueDateInput').value;  

    // Validar campos vacíos
    if (!title || !dueDateStr) {
        showCustomAlert(" Por favor, completa todos los campos del formulario de tarea.", "error");
        return;
    }

    // Validar que la fecha de vencimiento no sea anterior a la fecha de creación
    const creationDate = new Date().toISOString().split('T')[0]; 
    const dueDate = new Date(dueDateStr);
    const creationDateObj = new Date(creationDate);

    if (dueDate < creationDateObj) {
        showCustomAlert(
            " La Fecha de Vencimiento no puede ser anterior a la Fecha de Creación.\n\n Fecha de creación: " + creationDate + "\n Fecha ingresada: " + dueDateStr,
            "error",
            5000
        );
        return;
    }

    const currentUser = AuthManager.getCurrentUser();

    // Crear objeto de nueva tarea
    const newTaskData = {
        titulo: title,
        fechaCreacion: creationDate,
        fechaVencimiento: dueDateStr,
        idUsuario: currentUser.id 
    };

    DBManager.addTask(newTaskData);
    console.log("Nueva tarea agregada:", newTaskData);
    
    UIManager.clearNewTaskForm();  // Limpiar formulario
    UIManager.renderTasks();       // Actualizar lista de tareas
    
    showCustomAlert(" ¡Tarea agregada exitosamente!", "success", 2000);
});

// ============================================
// EVENTO: CERRAR SESIÓN
// ============================================

logoutButton.addEventListener('click', function () { 
    AuthManager.logout();
    UIManager.showLoginSection();  // Volver a pantalla de login
});

// ============================================
// FUNCIÓN DE ALERTA (FALLBACK)
// ============================================

/**
 * Muestra una alerta personalizada
 * Si UIManager está disponible, usa su versión; si no, crea una alerta básica
 */
function showCustomAlert(message, type = 'info', duration = 3000) {
    if (typeof window.UIManager !== 'undefined' && window.UIManager.showCustomAlert) {
        window.UIManager.showCustomAlert(message, type, duration);
    } else {
        // Alerta básica de respaldo
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.innerHTML = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 300);
        }, duration);
    }
}

// ============================================
// EVENTO: CREAR NUEVO USUARIO (SOLO ADMIN)
// ============================================

const addUserForm = document.getElementById('addUserForm');
if (addUserForm) {
    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Verificar permisos (solo administradores pueden crear usuarios)
        if (!AuthManager.isAdmin()) {
            showCustomAlert(" No tienes permisos para crear usuarios", "error");
            return;
        }
        
        const userName = document.getElementById('newUserName').value.trim();
        const password = document.getElementById('newUserPassword').value.trim();
        const rol = document.getElementById('newUserRole').value;
        
        // Validar campos vacíos
        if (!userName || !password) {
            showCustomAlert(" Por favor, completa todos los campos", "error");
            return;
        }
        
        // Validar longitud mínima
        if (userName.length < 3) {
            showCustomAlert(" El nombre de usuario debe tener al menos 3 caracteres", "error");
            return;
        }
        
        if (password.length < 4) {
            showCustomAlert(" La contraseña debe tener al menos 4 caracteres", "error");
            return;
        }
        
        const newUser = {
            userName: userName,
            password: password,
            rol: rol
        };
        
        const success = DBManager.addUser(newUser);
        
        if (success) {
            showCustomAlert(` Usuario "${userName}" creado exitosamente`, "success");
            // Limpiar formulario
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserPassword').value = '';
            // Actualizar lista de usuarios en pantalla
            if (typeof UIManager.renderUsersList === 'function') {
                UIManager.renderUsersList();
            }
        } else {
            showCustomAlert(` El usuario "${userName}" ya existe`, "error");
        }
    });
}