
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

            alert("Usuario o contraseña incorrectos.");

        }
    });


    taskForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const title = document.getElementById('taskTitleInput').value.trim();
        const dueDateStr = document.getElementById('taskDueDateInput').value;  


        if (!title || !dueDateStr) {

            alert("Por favor, completa todos los campos del formulario de tarea.");
            return;
        }


        const creationDate = new Date().toISOString().split('T')[0]; 
        const dueDate = new Date(dueDateStr);
        const creationDateObj = new Date(creationDate);


        if (dueDate < creationDateObj) {

            alert("La Fecha de Vencimiento no puede ser anterior a la Fecha de Creación.");
            return;
        }


        const currentUser = AuthManager.getCurrentUser();

        if (!currentUser) {

            console.error("Error: No hay usuario logueado para asignar la tarea.");

            alert("Sesión expirada. Por favor, inicie sesión nuevamente.");
            AuthManager.logout(); 
            UIManager.showLoginSection(); 
            return;
        }


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
    });


    logoutButton.addEventListener('click', function () { 

        AuthManager.logout();

        UIManager.showLoginSection();
    });

