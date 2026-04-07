# 🐳 Operaciones y Despliegue (Docker)

Esta guía detalla cómo preparar, ejecutar y mantener el sistema utilizando contenedores.

---

## 🛠️ Requisitos de Infraestructura

| Servicio | Memoria Mínima | CPU Mínima | Almacenamiento |
| :--- | :--- | :--- | :--- |
| **Backend** | 1GB RAM | 1 vCore | 500MB |
| **Frontend** | 500MB RAM | 1 vCore | 300MB |
| **Base de Datos** | 1GB RAM | 2 vCore | 2GB+ (Datos) |

---

## 🚀 Despliegue con Docker Compose (Recomendado)

Situado en la carpeta `Docker/`, ejecuta:

```bash
docker-compose up --build -d
```

### 🧱 Explicación de los Servicios en `docker-compose.yml`:

1.  **`db-contabilidad`**: Instancia de PostgreSQL 16.
    *   **Puerto Externo**: `5434` (para evitar conflictos con instalaciones locales).
    *   **Persistencia**: Volumen mapeado a `./postgres-data`. ¡No borres esta carpeta si quieres mantener tus datos!
2.  **`backend`**: Servidor Spring Boot.
    *   **Puerto**: `8080`.
    *   **Variables**: `DB_HOST=db-contabilidad`. Se comunica con la DB a través de la red interna de Docker.
3.  **`frontend`**: Cliente Next.js.
    *   **Puerto**: `3000`.

---

## 💾 Persistencia y Backups

Los datos de la base de datos se almacenan físicamente en la carpeta del host:
`unapec-contabilidad/Docker/postgres-data`

### 🛡️ Cómo hacer un Backup Manual:
Si el contenedor está corriendo, puedes ejecutar:
```bash
docker exec -t postgres-contabilidad pg_dumpall -c -U USER_DB > backup_$(date +%Y%m%d).sql
```

---

## 🏗️ Desarrollo Local (Host-Based)

Si prefieres no usar Docker para las aplicaciones de código:

### **1. Base de Datos (Sólo DB)**
```bash
docker-compose up -d db-contabilidad
```

### **2. Configuración de Red Local**
Si corres el backend localmente, este buscará la DB en `localhost:5434` (que es el puerto expuesto en el compose).

### **3. Ejecución**
*   **Backend**: `.\mvnw.cmd spring-boot:run` (Windows) o `./mvnw spring-boot:run` (Unix).
*   **Frontend**: `npm install && npm run dev` (requiere Node 20+).

---

## 🐞 Resolución de Problemas (Troubleshooting)

### **1. Puerto 8080 o 3000 ya ocupado**
Si otra aplicación usa estos puertos, el contenedor fallará al iniciar. Asegúrate de detener procesos locales de Node o Java previos.

### **2. La base de datos no inicia**
Verifica que tengas permisos de escritura en la carpeta `Docker/postgres-data`. Docker necesita crear los archivos de datos ahí.

### **3. No se ven datos en el Dashboard**
Revisa que el API `/api/dashboard/stats/monthly` responda datos reales. El Dashboard solo muestra información si existen asientos contables con cuentas que inicien con código **4** (Ingresos) o **5/6** (Gastos).
