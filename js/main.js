const loginForm = document.getElementById('loginForm');
const taskForm = document.getElementById('taskForm');
const logoutButton = document.getElementById('logoutButton'); 

loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    const userLoggedIn = AuthManager.login(username, password);

    if (userLoggedIn) {
        UIManager.showMainSection(userLoggedIn);
    } else {
        showCustomAlert("Usuario o contraseña incorrectos.", "error");
    }
});

taskForm.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const title = document.getElementById('taskTitleInput').value.trim();
    const dueDateStr = document.getElementById('taskDueDateInput').value;  

    if (!title || !dueDateStr) {
        showCustomAlert(" Por favor, completa todos los campos del formulario de tarea.", "error");
        return;
    }

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

    
    const newTaskData = {
        titulo: title,
        fechaCreacion: creationDate,
        fechaVencimiento: dueDateStr,
        idUsuario: currentUser.id 
    };

    DBManager.addTask(newTaskData);
    console.log("Nueva tarea agregada:", newTaskData);
    UIManager.clearNewTaskForm();
    UIManager.renderTasks();
    
    showCustomAlert(" ¡Tarea agregada exitosamente!", "success", 2000);
});

logoutButton.addEventListener('click', function () { 
    AuthManager.logout();
    UIManager.showLoginSection();
});

function showCustomAlert(message, type = 'info', duration = 3000) {
    if (typeof window.UIManager !== 'undefined' && window.UIManager.showCustomAlert) {
        window.UIManager.showCustomAlert(message, type, duration);
    } else {
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

const addUserForm = document.getElementById('addUserForm');
if (addUserForm) {
    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!AuthManager.isAdmin()) {
            showCustomAlert(" No tienes permisos para crear usuarios", "error");
            return;
        }
        
        const userName = document.getElementById('newUserName').value.trim();
        const password = document.getElementById('newUserPassword').value.trim();
        const rol = document.getElementById('newUserRole').value;
        
        if (!userName || !password) {
            showCustomAlert(" Por favor, completa todos los campos", "error");
            return;
        }
        
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
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserPassword').value = '';
            
            if (typeof UIManager.renderUsersList === 'function') {
                UIManager.renderUsersList();
            }
        } else {
            showCustomAlert(` El usuario "${userName}" ya existe`, "error");
        }
    });
}