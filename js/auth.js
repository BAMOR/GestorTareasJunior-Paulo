/**
 * MÓDULO DE AUTENTICACIÓN (auth.js)
 * 
 * Maneja el inicio y cierre de sesión de usuarios.
 * Controla el estado del usuario actual y verifica permisos según rol.
 */

(function (global) {

    // ============================================
    // ESTADO DE SESIÓN
    // ============================================
    
    /** Usuario actualmente logueado (null si no hay sesión activa) */
    let currentUser = null;

    // ============================================
    // FUNCIONES DE AUTENTICACIÓN
    // ============================================

    /**
     * Intenta iniciar sesión con username y password
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Object|null} - Datos del usuario si es exitoso, null si falla
     */
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

    /** Cierra la sesión actual (elimina el usuario de la variable currentUser) */
    function logout() {
        console.log(`Cierre de sesión para el usuario: ${currentUser ? currentUser.userName : 'Nadie'}`);
        currentUser = null;
    };

    /** Verifica si hay un usuario logueado actualmente */
    function isAuthenticated() {
        return currentUser !== null;
    };

    /** Obtiene los datos del usuario actualmente logueado */
    function getCurrentUser() {
        return currentUser;
    };

    /**
     * Verifica si el usuario actual es administrador
     * Solo retorna true si hay sesión activa Y el rol es 'administrador'
     */
    function isAdmin() {
        return isAuthenticated() && getCurrentUser().rol === 'administrador';
    };

    // ============================================
    // EXPORTACIÓN DEL MÓDULO
    // ============================================
    
    /** Exponer funciones al objeto global AuthManager */
    global.AuthManager = {
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        isAdmin
    };

})(window);