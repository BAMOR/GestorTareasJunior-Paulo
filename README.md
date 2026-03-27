# 📋 Gestor de Tareas

Aplicación web para gestión de tareas con sistema de autenticación y roles (Administrador / Usuario Normal). Desarrollada con JavaScript Vanilla, HTML5 y CSS3.

## 📹 Video de Demostración

[![Ver video demostrativo](https://img.youtube.com/vi/j-Lya5PfJoU/0.jpg)](https://youtu.be/j-Lya5PfJoU)

*Haz clic en la imagen para ver el video completo*

**Contenido del video:**
- Login con usuario normal y administrador
- CRUD de tareas según rol
- Gestión de usuarios (solo administrador)
- Validaciones de fechas
- Persistencia de datos con localStorage

## 🚀 Características

- ✅ **Autenticación de usuarios** (login/logout)
- 👥 **Sistema de roles**:
  - 👑 **Administrador**: Visualiza y gestiona todas las tareas de todos los usuarios
  - 👤 **Usuario Normal**: Solo visualiza y gestiona sus propias tareas
- 📝 **CRUD completo de tareas** (Crear, Leer, Actualizar, Eliminar)
- 👥 **Gestión de usuarios** (solo administradores pueden crear/eliminar usuarios)
- 📅 **Validaciones**:
  - Fecha de vencimiento no puede ser anterior a fecha de creación
  - Campos obligatorios en formularios
- 🎨 **Interfaz responsive** (Mobile First)
- 🚨 **Alertas visuales** para tareas vencidas y confirmaciones
- 💾 **Persistencia de datos** con localStorage

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura de la aplicación
- **CSS3** - Estilos y diseño responsive (Flexbox, Grid, Media Queries)
- **JavaScript Vanilla** - Lógica de la aplicación, manipulación del DOM y localStorage
- **SQL** - Script de base de datos relacional (MySQL)
