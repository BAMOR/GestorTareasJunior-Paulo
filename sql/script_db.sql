CREATE DATABASE IF NOT EXISTS GestorTareasJunior;
USE GestorTareasJunior; -- Usamos el nombre completo para consistencia

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'usuarioNormal') NOT NULL
);

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    estado ENUM('Pendiente', 'Completada') NOT NULL DEFAULT 'Pendiente',
    fechaCreacion DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DELIMITER $$

CREATE TRIGGER beforeInsertTarea
BEFORE INSERT ON tareas
FOR EACH ROW
BEGIN
    IF NEW.fechaVencimiento < NEW.fechaCreacion THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La Fecha de Vencimiento no puede ser anterior a la Fecha de Creacion.';
    END IF;
END$$

CREATE TRIGGER beforeUpdateTarea
BEFORE UPDATE ON tareas
FOR EACH ROW
BEGIN
    IF NEW.fechaVencimiento < NEW.fechaCreacion THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La Fecha de Vencimiento no puede ser anterior a la Fecha de Creacion.';
    END IF;
END$$

DELIMITER ;

INSERT INTO usuarios (userName, password, rol) VALUES
('admin_user', 'password_admin', 'administrador'),
('juan_perez', 'password_juan', 'usuarioNormal'),
('ana_gomez', 'password_ana', 'usuarioNormal');


INSERT INTO tareas (titulo, estado, fechaCreacion, fechaVencimiento, idUsuario) VALUES
('Revisar documentación del proyecto', 'Pendiente', '2024-05-10', '2024-09-15', 2),
('Enviar reporte mensual', 'Completada', '2024-05-05', '2024-08-20', 2),
('Actualizar CV', 'Pendiente', '2024-05-12', '2024-06-30', 3),
('Preparar presentación para reunión', 'Pendiente', '2024-05-01', '2024-05-25', 1),
('Investigar nuevas tecnologías', 'Pendiente', '2024-05-15', '2024-10-10', 3);


SELECT * FROM tareas ORDER BY fechaVencimiento ASC;

SELECT u.userName, t.estado, COUNT(*) AS cantidadTareas
FROM usuarios u
JOIN tareas t ON u.id = t.idUsuario
GROUP BY u.userName, t.estado
ORDER BY u.userName, t.estado;

SELECT * FROM tareas WHERE estado = 'Pendiente' AND fechaVencimiento < CURDATE();