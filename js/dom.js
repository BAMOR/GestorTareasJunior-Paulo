(function (global) {
    function showLoginSection() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('mainSection').style.display = 'none';
    }

    function showMainSection(user) {
        document.getElementById('loggedUserName').textContent = user.userName;
        document.getElementById('userRoleDisplay').textContent = user.rol.charAt(0).toUpperCase() + user.rol.slice(1);

        const taskListTitle = document.querySelector('#tasksListContainer h3');
       
        if (global.AuthManager.isAdmin()) {
            taskListTitle.textContent = 'Todas las Tareas';
        } else {
            taskListTitle.textContent = 'Mis Tareas';
        }

        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainSection').style.display = 'block';

        renderTasks();
    }

    function renderTasks() {
        const tasksContainer = document.getElementById('tasksList');
        const currentUser = global.AuthManager.getCurrentUser();
        let tasksToRender = [];

        if (global.AuthManager.isAdmin()) {
            tasksToRender = global.DBManager.getTasks();
        } else {
            tasksToRender = global.DBManager.getTasksByUserId(currentUser.id);
        }

        tasksContainer.innerHTML = '';

        if (tasksToRender.length === 0) {
            tasksContainer.innerHTML = '<p>No hay tareas para mostrar.</p>';
            return;
        }

        tasksToRender.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';

            const today = new Date();
            const dueDate = new Date(task.fechaVencimiento);
            const isOverdue = task.estado === 'Pendiente' && dueDate < today;

            if (isOverdue) {
                taskElement.classList.add('vencida');
            }

            if (task.estado === 'Completada') {
                taskElement.classList.add('completada');
            }

            let assignedUserText = '';
            if (global.AuthManager.isAdmin()) {
                const assignedUser = global.DBManager.getUsers().find(u => u.id === task.idUsuario);
                assignedUserText = assignedUser ? ` (Asignada a: ${assignedUser.userName})` : ` (ID Usuario: ${task.idUsuario})`;
            }

            const formattedCreationDate = new Date(task.fechaCreacion).toLocaleDateString();
            const formattedDueDate = new Date(task.fechaVencimiento).toLocaleDateString();

            taskElement.innerHTML = `
                <div class="task-content">
                    <div class="task-title">${task.titulo}</div>
                    <div class="task-details">Estado: ${task.estado} | Creada: ${formattedCreationDate} | Vence: ${formattedDueDate}${assignedUserText}</div>
                </div>
                <div class="task-actions">
                   ${!global.AuthManager.isAdmin() ? `<button class="btn-complete" data-task-id="${task.id}">${task.estado === 'Pendiente' ? 'Marcar Completada' : 'Marcar Pendiente'}</button>` : ''}
                    <button class="btn-delete" data-task-id="${task.id}">Eliminar</button>
                </div>
            `;

            const completeBtn = taskElement.querySelector('.btn-complete');
            const deleteBtn = taskElement.querySelector('.btn-delete');

            if (completeBtn) {
                completeBtn.addEventListener('click', (event) => {
                    const taskId = parseInt(event.currentTarget.getAttribute('data-task-id'));
                    toggleTaskStatus(taskId);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (event) => {
                    const taskId = parseInt(event.currentTarget.getAttribute('data-task-id'));
                    deleteTask(taskId);
                });
            }

            tasksContainer.appendChild(taskElement);
        });
    }

    function toggleTaskStatus(taskId) {
        const tasks = global.DBManager.getTasks();
        const task = tasks.find(t => t.id === taskId); 
        if (task) {
            const newStatus = task.estado === 'Pendiente' ? 'Completada' : 'Pendiente';
            global.DBManager.updateTask(taskId, { estado: newStatus });
            console.log(`Estado de la tarea ${taskId} actualizado a: ${newStatus}`);
            renderTasks();
        } else {
            console.error(`No se encontró la tarea con ID ${taskId} para cambiar estado.`);
        }
    }

    function deleteTask(taskId) {
        showCustomConfirmAlert(
            "¿Estás seguro de que deseas eliminar esta tarea?",
            function() {
                global.DBManager.deleteTask(taskId);
                console.log(`Tarea con ID ${taskId} eliminada.`);
                renderTasks();
                showCustomAlert(" Tarea eliminada exitosamente", "success");
            },
            function() {
                showCustomAlert(" Eliminación cancelada", "info");
            }
        );
    }

    function showCustomConfirmAlert(message, onConfirm, onCancel) {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-alert alert-confirm';
        
        alertDiv.innerHTML = `
            <div style="margin-bottom: 10px;"> ${message}</div>
            <div class="alert-buttons">
                <button class="btn-confirm">Sí, eliminar</button>
                <button class="btn-cancel">Cancelar</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        const confirmBtn = alertDiv.querySelector('.btn-confirm');
        const cancelBtn = alertDiv.querySelector('.btn-cancel');
        
        confirmBtn.addEventListener('click', function() {
            closeAlert(alertDiv);
            if (onConfirm) onConfirm();
        });
        
        cancelBtn.addEventListener('click', function() {
            closeAlert(alertDiv);
            if (onCancel) onCancel();
        });
    }

    function showCustomAlert(message, type = 'info', duration = 3000) {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.innerHTML = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            closeAlert(alertDiv);
        }, duration);
    }

    function closeAlert(alertElement) {
        alertElement.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 300);
    }

    function clearNewTaskForm() {
        document.getElementById('taskTitleInput').value = '';
        document.getElementById('taskDueDateInput').value = '';
    }

    global.UIManager = {
        showLoginSection,
        showMainSection,
        renderTasks,
        toggleTaskStatus,
        deleteTask,
        clearNewTaskForm,
        showCustomAlert,
        showCustomConfirmAlert
    };
})(window);