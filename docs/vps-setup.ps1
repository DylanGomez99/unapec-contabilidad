# 🛠️ Script de Configuración Inicial - VPS Windows Server
# Versión: 1.0 (Senior DevOps Edition)

Write-Host "--- Iniciando Configuración de Seguridad y Entorno para Contabilidad Central ---" -ForegroundColor Cyan

# 1. Abrir Puertos en el Firewall de Windows
Write-Host "[1/3] Configurando Reglas de Entrada en el Firewall..." -ForegroundColor Yellow

$Rules = @(
    @{Name="Accounting-HTTP"; Port=80; Protocol="TCP"; Description="Acceso Principal vía Nginx"},
    @{Name="Accounting-Frontend"; Port=3000; Protocol="TCP"; Description="Acceso Directo Dashboard"},
    @{Name="Accounting-Backend"; Port=8080; Protocol="TCP"; Description="Acceso Directo API"},
    @{Name="Accounting-Postgres"; Port=5434; Protocol="TCP"; Description="Acceso PostgreSQL"}
)

foreach ($Rule in $Rules) {
    if (Get-NetFirewallRule -Name $Rule.Name -ErrorAction SilentlyContinue) {
        Write-Host "    - La regla $($Rule.Name) ya existe. Saltando..." -ForegroundColor Gray
    } else {
        New-NetFirewallRule -DisplayName $Rule.Name `
                            -Direction Inbound `
                            -Action Allow `
                            -Protocol $Rule.Protocol `
                            -LocalPort $Rule.Port `
                            -Description $Rule.Description `
                            -Group "Accounting Application"
        Write-Host "    - Regla $($Rule.Name) creada con éxito (Puerto $($Rule.Port))." -ForegroundColor Green
    }
}

# 2. Verificar Instalación de Docker & Docker Compose
Write-Host "[2/3] Verificando Docker..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $DockerVersion = docker --version
    Write-Host "    - Docker detectado: $DockerVersion" -ForegroundColor Green
} else {
    Write-Warning "    - Docker no detectado. Por favor instale Docker Desktop o Docker EE antes de continuar."
}

# 3. Crear Estructura de Directorios para Persistencia
Write-Host "[3/3] Asegurando estructura de persistencia..." -ForegroundColor Yellow
$DockerPath = Join-Path $PSScriptRoot "Docker"
$DataPath = Join-Path $DockerPath "postgres-data"

if (!(Test-Path $DataPath)) {
    New-Item -ItemType Directory -Path $DataPath -Force
    Write-Host "    - Carpeta de persistencia creada en: $DataPath" -ForegroundColor Green
} else {
    Write-Host "    - Carpeta de persistencia ya existe." -ForegroundColor Gray
}

Write-Host "`n--- Configuración Finalizada con Éxito ---" -ForegroundColor Cyan
Write-Host "Próximo paso: Ejecute 'docker-compose up --build -d' dentro de la carpeta Docker."
