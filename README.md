# 📊 Sistema de Contabilidad Central - UNAPEC

Este proyecto es el **núcleo de integración** para la asignatura de Integración de Aplicaciones. Actúa como un "Libro Mayor" centralizado, exponiendo servicios REST para que módulos externos (**Nómina, Facturación, Inventario, etc.**) registren movimientos contables estandarizados, y proveyendo un **Dashboard Administrativo** de alto nivel.

---

## 🌎 Despliegue en Producción (Live Demo)

El sistema se encuentra desplegado y operativo en una VPS dedicada. Puedes acceder mediante los siguientes enlaces:

| Servicio | URL de Acceso |
| :--- | :--- |
| **📊 Dashboard (Web)** | [http://151.242.194.24/](http://151.242.194.24/) |
| **📘 Documentación API (Swagger)** | [http://151.242.194.24/api/swagger-ui.html](http://151.242.194.24/api/swagger-ui.html) |

---

### 🗄️ Acceso Remoto a Base de Datos (DBeaver/Navicat)
Para gestionar los datos directamente desde tu PC personal, utiliza esta configuración:
- **Host**: `151.242.194.24`
- **Port**: `5434` (Puerto externo mapeado)
- **Database**: `contabilidad_db`
- **User**: `USER_DB` | **Pass**: `2026DB`

---

## 🛠️ Stack Tecnológico

### ☕ Back-end & Datos
*   **Lenguaje:** Java 21
*   **Framework:** Spring Boot 3.4.x
*   **Base de Datos:** PostgreSQL 16
*   **Documentación API:** SpringDoc OpenAPI (Swagger UI)
*   **Contenedores:** Docker & Docker Compose

### ⚛️ Front-end (Dashboard)
*   **Framework:** Next.js 16 (App Router)
*   **Estilos:** Tailwind CSS 3.4 + Apple Design Aesthetics
*   **Gráficos:** Recharts (Real-time integration)

---

## 📚 Base de Conocimientos (Documentación Avanzada)

Para obtener detalles técnicos profundos, consulta las siguientes guías:

*   **[🏛️ Arquitectura del Sistema](./docs/architecture.md)**: Diagramas C4, Stack Tecnológico y flujos.
*   **[🔌 Protocolo de Integración API](./docs/api-integration.md)**: Cómo registrar asientos desde otros módulos.
*   **[📊 Modelo de Datos y Lógica](./docs/data-model.md)**: Diagrama ER y reglas de negocio contables.
*   **[🐳 Operaciones y Despliegue](./docs/deployment.md)**: Docker, volúmenes y mantenimiento.

---

## 🚀 Guía de Inicio Rápido

La forma más sencilla de ejecutar todo el sistema (Base de Datos + Backend + Frontend) es usando Docker Compose.

1.  **Clonar el repositorio** y navegar a la carpeta raíz.
2.  **Levantar los contenedores**:
    ```bash
    cd Docker
    docker-compose up --build -d
    ```
3.  **Acceder a las aplicaciones**:
    -   **Frontend (Dashboard)**: [http://localhost:3000](http://localhost:3000)
    -   **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
    -   **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
    -   **Base de Datos**: `localhost:5434` (User: `USER_DB`, Pass: `2026DB`)

---

## 💻 Desarrollo Local (Sin Docker para Apps)

Si deseas modificar el código y ver los cambios en tiempo real:

### 1. Solo la Base de Datos (Docker)
```bash
cd Docker
docker-compose up -d db-contabilidad
```

### 2. Backend (Spring Boot)
Desde `backend-contabilidad`:
```bash
# Windows
.\mvnw.cmd spring-boot:run
# Linux/Mac
./mvnw spring-boot:run
```

### 3. Frontend (Next.js)
Desde `frontend-contabilidad`:
```bash
npm install
npm run dev
```

---

## 🔌 Integración con API de Contabilidad: Módulo de Asientos

Este apartado expone las especificaciones técnicas para la integración de módulos externos (Facturación, Nómina, Inventario, etc.) con el sistema central de Contabilidad mediante la API REST.

### 1. Concepto de Asiento Contable
Un Asiento Contable es el registro transaccional indivisible que documenta un evento económico. Cada vez que un módulo externo ejecuta una operación que afecta el valor de la empresa, debe generar un asiento hacia esta API para ser procesado contablemente.

**Regla de Negocio: Partida Doble**
El sistema valida todas las transacciones basándose en la regla de **Partida Doble**. Cada asiento requiere un mínimo de dos movimientos de cuentas distribuyéndose bajo las siguientes naturalezas:
* **Débito:** Entrada o incremento de fondos, activos o gastos.
* **Crédito:** Salida, origen de los fondos, pasivos o ingresos.

> [!IMPORTANT]
> **Validación Estricta:** La sumatoria matemática de los registros marcados como `Debito` debe ser igual a la sumatoria de los registros marcados como `Credito`. Si el asiento no cumple con este balance (asiento "descuadrado"), la API rechazará la transacción.

### 2. Flujo de Integración Esperado
Al completar una transacción en su sistema origen, el módulo debe ejecutar una petición HTTP a Contabilidad indicando las cuentas impactadas. 
El sistema de Contabilidad centraliza los balances en tiempo real, lo que significa que el módulo origen solo necesita enviar los identificadores (ID) de las cuentas (hijas y no agrupadoras) previamente mapeadas junto con el valor bruto.

### 3. Especificación del Endpoint y Payload
**Endpoint:** `POST /api/asientos`  
**Content-Type:** `application/json`

#### Cabecera (Raíz del Objeto) JSON
| Propiedad | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `descripcion` | String | **Sí** | Concepto alfanumérico claro de la transacción. |
| `fechaAsiento`| String | **Sí** | Fecha de ocurrencia en formato `YYYY-MM-DD`. |
| `moneda` | Objeto | **Sí** | Identificador de la moneda (ej. `{ "id": 1 }`). |
| `auxiliar` | Objeto | Opc. | Identificador del sistema/módulo de origen. |
| `detalles` | Array | **Sí** | Colección de los movimientos financieros (Mín. 2). |

#### Ejemplo Práctico de Payload
```json
{
  "descripcion": "Pago Quincenal Nómina Operaciones - Periodo 1",
  "fechaAsiento": "2026-04-15",
  "moneda": { "id": 1 },
  "auxiliar": { "id": 3 },
  "detalles": [
    {
      "cuenta": { "id": 610 }, 
      "tipoMovimiento": "Debito",
      "monto": 45000.00
    },
    {
      "cuenta": { "id": 102 }, 
      "tipoMovimiento": "Credito",
      "monto": 45000.00
    }
  ]
}
```

### 4. Pruebas y Criterios de Aceptación
Para autorizar la integración, el cliente HTTP debe prever 3 escenarios base:
1. **Pase correcto (`201 Created`):** Débitos = Créditos hacia cuentas válidas. Retorna cuerpo del asiento con `id`.
2. **Asiento Descuadrado (`400 Bad Request`):** Montos dispares. La API arroja `IllegalArgumentException: Asiento descuadrado`. 
3. **Bloqueo Nivel Cuenta (`400 Bad Request`):** Transacción balanceada apuntando a una cuenta "Padre" o Agrupadora (no admite movimientos directos).

---

## ⚙️ Variables de Entorno (Personalización)

El sistema utiliza las siguientes variables (configuradas por defecto en `docker-compose.yml`):

| Variable | Descripción | Valor Defecto |
| :--- | :--- | :--- |
| `DB_HOST` | Host de la base de datos | `db-contabilidad` (Docker) / `localhost` |
| `DB_PORT` | Puerto de la base de datos | `5432` (Docker) / `5434` |
| `DB_NAME` | Nombre de la base de datos | `contabilidad_db` |
| `DB_USER` | Usuario DB | `USER_DB` |
| `DB_PASS` | Password DB | `2026DB` |

---

## 👨‍💻 Autor
* **Alan Roman** - UNAPEC (ID: A00116751)
* **Desplegado por**: Antigravity (AI DevOps Engineer)
