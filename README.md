# 📊 Sistema de Contabilidad Central - UNAPEC

Este proyecto representa el **núcleo del sistema de integración** para la asignatura de Integración de Aplicaciones. Su función principal es actuar como un "Libro Mayor" centralizado, exponiendo servicios REST para que módulos externos (**Nómina, Facturación, Inventario**, etc.) registren sus movimientos contables de forma estandarizada, además de proveer un **Dashboard Administrativo** para la gestión visual.

---

## 🛠️ Stack Tecnológico

### ☕ Back-end & Datos
* **Lenguaje:** Java 21
* **Framework:** Spring Boot 3.4.x
* **Base de Datos:** PostgreSQL 16
* **Persistencia:** Spring Data JPA + Flyway (Migraciones)
* **Contenedores:** Docker & Docker Compose

### ⚛️ Front-end (Dashboard)
* **Lenguaje:** TypeScript + React 19
* **Framework:** Next.js (App Router / Turbopack)
* **Estilos:** Tailwind CSS
* **Librerías Clave:** React Hook Form, Zod, Axios, jsPDF, Lucide React

---

## 🚀 Guía de Inicio Rápido

### 1. Infraestructura (Docker)
El proyecto utiliza una instancia de PostgreSQL aislada para evitar conflictos de puertos en tu máquina.

1. Navega a la carpeta de configuración: `cd Docker`
2. Levanta el contenedor:
```bash
docker-compose up -d
```
> **Conexión:** La base de datos estará disponible en el puerto **5434**.

---

### 2. Ejecución del Backend
Desde la raíz de la carpeta `backend-contabilidad`:

1. Revisa las credenciales en `src/main/resources/application.yml` (por defecto apunta a `localhost:5434` con pass `2026DB`).
2. Corre el servidor:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```
*Nota: Flyway ejecutará automáticamente los scripts en `db/migration` para crear las tablas.*

---

### 3. Ejecución del Frontend
Desde la raíz de la carpeta `frontend-contabilidad`:

1. Instala dependencias:
```bash
npm install
```
2. Corre el servidor de desarrollo:
```bash
npm run dev
```
> **Acceso:** El Dashboard estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🔌 Guía de Integración (API REST)

Para los equipos de módulos externos, el punto de entrada principal es el registro de asientos contables.

### Registro de Asientos
* **Método:** `POST`
* **Endpoint:** `/api/asientos`
* **Content-Type:** `application/json`

#### Estructura del JSON:
```json
{
  "descripcion": "Registro de nómina mensual - Marzo 2026",
  "auxiliarId": 2,
  "monto": 150000.00,
  "detalles": [
    {
      "cuentaId": 101,
      "tipoMovimiento": "Debito",
      "monto": 150000.00
    }
  ]
}
```

---

## 📂 Estructura del Proyecto

```text
📂 Contabilidad
├── 📂 backend-contabilidad  # API REST construida con Spring Boot
├── 📂 frontend-contabilidad # Dashboard Administrativo construido con Next.js
├── 📂 DB Scripts            # Respaldos y scripts SQL adicionales
├── 📂 Docker                # Orquestación de contenedores (PostgreSQL)
└── 📄 .gitignore            # Exclusiones de Git globales
```

---

## 👨💻 Autor

* **Alan Roman**
* *Estudiante de Ingeniería de Software - UNAPEC*
* **ID:** A00116751
