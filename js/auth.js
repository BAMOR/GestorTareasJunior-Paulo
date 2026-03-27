

(function (global) {

    let currentUser = null;


    function login(username, password) {

        const user = global.DBManager.getUserByUsername(username);

        if (user && user.password === password) {
            currentUser = user;
            console.log(`Inicio de sesion exitoso para el usuario ${username}, Rol: ${user.rol}`);
            return user;

        } else {
            console.error("Credenciales inválidas para:", username);
            return null;
        }
    };


    function logout() {
        console.log(`Cierre de sesión para el usuario: ${currentUser ? currentUser.userName : 'Nadie'}`);
        currentUser = null;
    };

    function isAuthenticated() {
        return currentUser !== null;
    };

    function getCurrentUser() {
        return currentUser;
    };

    function isAdmin() {
        return isAuthenticated() && getCurrentUser().rol === 'administrador';
    };

    global.AuthManager = {
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        isAdmin
    };



})(window);