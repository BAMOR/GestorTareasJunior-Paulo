/**
 * SCRIPT SQL - GESTOR DE TAREAS
 * 
 * Base de datos relacional para la gestión de usuarios y tareas.
 * Incluye tablas normalizadas, triggers de validación, datos de prueba y consultas requeridas.
 */

-- ============================================
-- CREACIÓN DE BASE DE DATOS
-- ============================================

CREATE DATABASE IF NOT EXISTS GestorTareasJunior;
USE GestorTareasJunior; -- Usamos el nombre completo para consistencia

-- ============================================
-- TABLA: USUARIOS
-- ============================================

/**
 * Almacena los usuarios del sistema
 * - id: Identificador único autoincremental
 * - userName: Nombre de usuario (único)
 * - password: Contraseña del usuario
 * - rol: Define permisos (administrador o usuarioNormal)
 */
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuarioNormal') NOT NULL
);

-- ============================================
-- TABLA: TAREAS
-- ============================================

/**
 * Almacena las tareas asignadas a los usuarios
 * - id: Identificador único autoincremental
 * - titulo: Descripción de la tarea
 * - estado: Pendiente o Completada (por defecto Pendiente)
 * - fechaCreacion: Fecha en que se creó la tarea
 * - fechaVencimiento: Fecha límite para completar la tarea
 * - idUsuario: Usuario asignado (clave foránea)
 */
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    estado ENUM('Pendiente', 'Completada') NOT NULL DEFAULT 'Pendiente',
    fechaCreacion DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
        ON DELETE CASCADE      -- Si se elimina un usuario, se borran sus tareas
        ON UPDATE CASCADE      -- Si cambia el ID del usuario, se actualiza automáticamente
);

-- ============================================
-- TRIGGERS DE VALIDACIÓN
-- ============================================

/**
 * Restricción: La fecha de vencimiento NO puede ser anterior a la fecha de creación
 * Estos triggers impiden que se inserten o actualicen tareas con fechas inválidas
 */

DELIMITER $$

/** Trigger que se ejecuta ANTES de insertar una nueva tarea */
CREATE TRIGGER beforeInsertTarea
BEFORE INSERT ON tareas
FOR EACH ROW
BEGIN
    IF NEW.fechaVencimiento < NEW.fechaCreacion THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La Fecha de Vencimiento no puede ser anterior a la Fecha de Creacion.';
    END IF;
END$$

/** Trigger que se ejecuta ANTES de actualizar una tarea existente */
CREATE TRIGGER beforeUpdateTarea
BEFORE UPDATE ON tareas
FOR EACH ROW
BEGIN
    IF NEW.fechaVencimiento < NEW.fechaCreacion THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La Fecha de Vencimiento no puede ser anterior a la Fecha de Creacion.';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

/** Inserción de 3 usuarios (1 administrador, 2 usuarios normales) */
INSERT INTO usuarios (userName, password, rol) VALUES
('admin_user', 'password_admin', 'administrador'),
('juan_perez', 'password_juan', 'usuarioNormal'),
('ana_gomez', 'password_ana', 'usuarioNormal');

/** Inserción de 5 tareas de prueba */
INSERT INTO tareas (titulo, estado, fechaCreacion, fechaVencimiento, idUsuario) VALUES
('Revisar documentación del proyecto', 'Pendiente', '2024-05-10', '2024-09-15', 2),  -- Tarea de Juan
('Enviar reporte mensual', 'Completada', '2024-05-05', '2024-08-20', 2),            -- Tarea de Juan
('Actualizar CV', 'Pendiente', '2024-05-12', '2024-06-30', 3),                      -- Tarea de Ana
('Preparar presentación para reunión', 'Pendiente', '2024-05-01', '2024-05-25', 1), -- Tarea del Admin
('Investigar nuevas tecnologías', 'Pendiente', '2024-05-15', '2024-10-10', 3);      -- Tarea de Ana

-- ============================================
-- CONSULTAS SOLICITADAS
-- ============================================

/**
 * 1. Listado completo de tareas ordenadas por proximidad de vencimiento
 *    Muestra todas las tareas ordenadas de la más próxima a vencer a la más lejana
 */
SELECT * FROM tareas ORDER BY fechaVencimiento ASC;

/**
 * 2. Conteo de tareas pendientes y completadas agrupadas por usuario
 *    Muestra cada usuario con la cantidad de tareas pendientes y completadas
 */
SELECT u.userName, t.estado, COUNT(*) AS cantidadTareas
FROM usuarios u
JOIN tareas t ON u.id = t.idUsuario
GROUP BY u.userName, t.estado
ORDER BY u.userName, t.estado;

/**
 * 3. Consulta de tareas atrasadas
 *    Tareas que están pendientes y cuya fecha de vencimiento es anterior a la fecha actual
 */
SELECT * FROM tareas WHERE estado = 'Pendiente' AND fechaVencimiento < CURDATE();