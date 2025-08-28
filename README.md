# 🧩 Ejercicio: Angular + .NET Core – Task Manager

Repo: https://github.com/wallshapel/ejercicio-angular-dotnet

Este proyecto contiene **dos aplicaciones** que trabajan juntas:

- **Backend**: API REST en **.NET 8** – carpeta `api-angular-backend`.
- **Frontend**: SPA en **Angular 20** – carpeta `api-dotnet-frontend`.

La meta es construir una app de **gestión de tareas** con:

- **Endpoints** `GET /api/tasks` y `POST /api/tasks`.
- **EF Core (Code‑First)** con SQL Server y *auto‑migrate* al arrancar.
- **Repository + Service + DTOs** para no exponer entidades.
- **Mapper** ligero por reflexión.
- **Angular Material** con **diseño mobile‑first** (breakpoints: `<600`, `600–959`, `≥960`).

---

## 📁 Estructura del repositorio
```
/angular-dotnet
├─ api-angular-backend/        # .NET 8 Web API
└─ api-dotnet-frontend/        # Angular 20
```

---

## 🚀 Ejecución con Docker (recomendada)

### Requisitos
- **Docker** y **Docker Compose** instalados.

### Levantar todo el stack
Desde la **raíz** del repo (`angular-dotnet/`):

```bash
# Construir imágenes y levantar en segundo plano
docker compose up -d
```

### Servicios y URLs
- **Backend (.NET)**: `http://localhost:8080`
  - **Swagger**: `http://localhost:8080/swagger`
  - **API**: `http://localhost:8080/api/tasks`
- **Frontend (Angular + Nginx)**: `http://localhost:8081`
- **SQL Server**: servicio `ejercicio-api-db` en la red de Docker (`Server=ejercicio-api-db,1433`).

> El *compose* ya inyecta `ConnectionStrings__DefaultConnection` en el backend para que resuelva el host del SQL dentro de la red de Docker (`ejercicio-api-db,1433`).

### Probar rápido con Postman
- **GET** `http://localhost:8080/api/tasks`
- **POST** `http://localhost:8080/api/tasks`
  - Body (JSON):
    ```json
    { "title": "Buy milk" }
    ```

---

## 🧭 Cambiar el backend objetivo (⚡ 7095 local ↔ 8080 docker)

Para no recompilar Angular cada vez, el frontend **lee la URL desde un `env.js`** que el contenedor genera al arrancar. Así puedes alternar entre:

- **Backend local (HTTPS)**: `https://localhost:7095`
- **Backend dockerizado (HTTP)**: `http://localhost:8080`

> **Cómo alternar:** cambia el valor de `API_BASE_URL` en el `docker-compose.yml`

---

## 💻 Frontend – `api-dotnet-frontend` (Angular 20)

### Componentes y UI
- **TaskComponent** (contenedor) + **TaskFormComponent** (form) + **TaskListComponent** (lista).
- **Angular Material**: `MatFormField`, `MatInput`, `MatButton`, `MatTable`, `MatSnackBar`, `MatProgressBar`.
- **Diseño mobile‑first**: columnas visibles según ancho (`<600`, `600–959`, `≥960`).

### Dependencias
- `@angular/*` (v20)
- `@angular/material`

### Modo local (Angular dev server)
```bash
cd api-dotnet-frontend
npm install
ng s -o   # http://localhost:4200
```
> Asegúrate que `window.__env.API_BASE_URL` (fallback o `env.js`) apunte a `https://localhost:7095` si corres backend local.

---

## 🛠️ Backend – `api-angular-backend` (.NET 8)

### Endpoints
- `GET /api/tasks` → lista de tareas (más recientes primero).
- `POST /api/tasks` → crea una tarea y devuelve **201 Created**.

### EF Core, Migraciones y Auto‑migrate
- `Database.Migrate()` en `Program.cs` aplica migraciones pendientes al arrancar.

### CORS (modo local)
Permite `http://localhost:4200` y `https://localhost:4200`.

### Modo local (HTTPS por defecto)
```bash
cd api-angular-backend
# (Opcional) dotnet-ef
dotnet tool update --global dotnet-ef

dotnet restore
# Migración inicial (si aplica)
dotnet ef migrations add InitialCreate
# Crear/actualizar DB local
dotnet ef database update
# Ejecutar API (perfil Development)
dotnet run
```
- URL: `https://localhost:7095`

---

## 🔒 CORS y Puertos (resumen)
- **Backend dockerizado**: `http://localhost:8080` (HTTP).  
- **Backend local**: `https://localhost:7095` (HTTPS) y `http://localhost:5136` (HTTP, redirige a HTTPS por defecto).
- **Frontend dockerizado**: `http://localhost:8081`.  
- **Frontend local (ng serve)**: `http://localhost:4200`.

**CORS**: asegúrate de incluir los orígenes que uses (`http://localhost:4200`, `http://localhost:8081`).

---

## 🧱 Arquitectura (resumen)
```
Controller → Service → Repository → DbContext
           ↘ DTOs/Mapper ↙
```
- **Controller**: `TaskController` (`/api/tasks`).
- **Service**: `ITaskService` / `TaskService`.
- **Repository**: `ITaskRepository` / `TaskRepository`.
- **DbContext**: `AppDbContext` con entidad `TaskItem` → tabla `Tasks`.
- **Mapper**: `IObjectMapper` + `ReflectionObjectMapper` (registrado **Singleton** en DI).

---

## 🧪 Prueba rápida (local HTTPS)
```text
GET  https://localhost:7095/api/tasks
POST https://localhost:7095/api/tasks
Body: { "title": "Buy milk" }
```

## 🧰 Scripts útiles
```bash
# Backend
cd api-angular-backend
 dotnet ef migrations add <Name>
 dotnet ef database update
 dotnet run

# Frontend
cd ../api-dotnet-frontend
 ng s -o
```

---
