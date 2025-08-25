# 🧩 Ejercicio: Angular + .NET Core – Task Manager

Repo: https://github.com/wallshapel/ejercicio-angular-dotnet

Este proyecto contiene **dos aplicaciones** que trabajan juntas:

- **Backend**: API REST en **.NET 8** – carpeta `api-angular-backend`.
- **Frontend**: SPA en **Angular 20** – carpeta `api-dotnet-frontend`.

La meta fue construir una app de **gestión de tareas** con:

- **Endpoints** `GET /api/tasks` y `POST /api/tasks`.
- **EF Core (Code‑First)** con SQL Server y *auto‑migrate* al arrancar.
- **Repository + Service + DTOs** para no exponer entidades.
- **Mapper** ligero por reflexión.
- **Angular Material** con **diseño mobile‑first** (breakpoints: `<600`, `600–959`, `≥960`).

---

## 📁 Estructura del repositorio
```
/ejercicio-angular-dotnet
├─ api-angular-backend/        # .NET 8 Web API
└─ api-dotnet-frontend/        # Angular 20
```

---

## 🛠️ Backend – `api-angular-backend` (.NET 8)

### Principales características
- **CORS** habilitado para `http://localhost:4200` y `https://localhost:4200`.
- **EF Core SQL Server** (Code‑First) y **`Database.Migrate()`** en `Program.cs` (crea DB/tabl as si no existen).
- **Patrón Repository + Service**.
- **DTOs** (`TaskDto`, `CreateTaskDto`).
- **Mapper** minimalista (`IObjectMapper` + `ReflectionObjectMapper`).

### Endpoints
- `GET /api/tasks` → lista de tareas (más recientes primero).
- `POST /api/tasks` → crea una tarea y devuelve **201 Created**.

### Paquetes NuGet usados
- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Design`

### ⚙️ Configuración requerida
Crea **`api-angular-backend/appsettings.Development.json`** con tu cadena de conexión (usa tus propios valores entre `<>`):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=<SERVER>,<PORT>;Database=<DATABASE>;User Id=<USER>;Password=<PASSWORD>;Encrypt=True;TrustServerCertificate=True"
  }
}
```
> Asegúrate de que el motor de **SQL Server** esté ejecutándose (por ejemplo, en `127.0.0.1,1433`). La base `tasks` se crea automáticamente si no existe.

### ▶️ Cómo ejecutar el backend (local)
```bash
cd api-angular-backend

# (Opcional) CLI de EF Core
dotnet tool update --global dotnet-ef

# Restaurar y compilar
dotnet restore

# Migración inicial y creación de la base
dotnet ef migrations add InitialCreate
dotnet ef database update

# Ejecutar la API
dotnet run
```
- URL de la API (perfil HTTPS por defecto): **`https://localhost:7095`**

> Nota: en el arranque, la app ejecuta `Database.Migrate()` para aplicar migraciones pendientes automáticamente.

---

## 💻 Frontend – `api-dotnet-frontend` (Angular 20)

### Principales características
- **TaskComponent** (contenedor) + **TaskFormComponent** (form) + **TaskListComponent** (lista).
- **HttpClient** inyectado con `API_BASE_URL` (Injection Token) → `https://localhost:7095`.
- **Angular Material**: `MatFormField`, `MatInput`, `MatButton`, `MatTable`, `MatSnackBar`, `MatProgressBar`.
- **Diseño mobile‑first** con CSS (solo colores **HEX**):
  - `<600px`: el botón pasa a segunda fila y la tabla muestra solo la columna **Task**.
  - `600–959px`: muestra **Task** y **Status**.
  - `≥960px`: muestra **Task / Created / Status**.

### Dependencias relevantes (frontend)
- `@angular/*` (v20)
- `@angular/material`

### ▶️ Cómo ejecutar el frontend (local)
```bash
cd api-dotnet-frontend
npm install
ng s -o   # abre http://localhost:4200
```

> El token `API_BASE_URL` se provee en `src/app/app.config.ts`. Asegúrate de que apunte a `https://localhost:7095` (o ajusta el puerto si cambiaste el backend).

---

## 🔒 CORS y puertos
- **Backend**: `https://localhost:7095` (HTTPS) y `http://localhost:5136` (HTTP). La app usa `UseHttpsRedirection()` ⇒ si llamas por HTTP verás **307 Redirect** a HTTPS.
- **Frontend**: `http://localhost:4200`.

La política CORS permite ambos orígenes (`http://localhost:4200`, `https://localhost:4200`).

---

## 🧱 Arquitectura (resumen)
```
Controller → Service → Repository → DbContext
           ↘ DTOs/Mapper ↙
```
- **Controller**: `TaskController` (`/api/tasks`).
- **Service**: `ITaskService` / `TaskService` (aplica reglas de negocio simples y mapea DTOs).
- **Repository**: `ITaskRepository` / `TaskRepository` (EF Core `AppDbContext`).
- **DbContext**: `AppDbContext` con entidad `TaskItem` → tabla `Tasks`.
- **Mapper**: `IObjectMapper` + `ReflectionObjectMapper` (registro **Singleton** en DI).

---

## 🧪 Prueba rápida con curl
```bash
# Listar
curl -k https://localhost:7095/api/tasks

# Crear
curl -k -X POST https://localhost:7095/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

---

## 🧩 Solución de problemas
- **404 en `/api/tasks`**: verifica que el controlador tenga `[Route("api/tasks")]` y que el puerto coincida con `launchSettings.json`.
- **307 Redirect desde HTTP**: usa la URL **HTTPS** del backend (`https://localhost:<puerto>`).
- **CORS**: si ves errores de CORS, confirma que el frontend corre en `http://localhost:4200` y que CORS esté habilitado en `Program.cs`.
- **Certificado de desarrollo**: si el navegador advierte sobre HTTPS, confía el certificado local de ASP.NET Core.
- **Conexión a SQL Server**: valida `Server`, `User Id`, `Password` y `TrustServerCertificate=True` en la cadena de conexión.

---

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

