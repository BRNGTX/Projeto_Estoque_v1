# Script de Inicializacao do Sistema de Controle de Estoque
# Este script verifica pre-requisitos, configura o banco de dados e inicia o projeto

param(
    [switch]$SkipDbCheck = $false,
    [switch]$BuildOnly = $false
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Controle de Estoque" -ForegroundColor Cyan
Write-Host "  Script de Inicializacao" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Funcao para verificar se um comando existe
function Test-Command {
    param($CommandName)
    try {
        Get-Command $CommandName -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Funcao para verificar se o MySQL esta rodando
function Test-MySQLConnection {
    Write-Host "Verificando conexao com MySQL..." -ForegroundColor Yellow
    try {
        if (Test-Command "mysql") {
            Write-Host "MySQL cliente encontrado" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "MySQL cliente nao encontrado no PATH" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "Erro ao verificar MySQL: $_" -ForegroundColor Red
        return $false
    }
}

# Funcao para criar o banco de dados usando o script SQL
function Initialize-Database {
    Write-Host "Inicializando banco de dados..." -ForegroundColor Yellow
    $scriptPath = "InfraEstrutura\Scripts\create_database.sql"
    
    if (Test-Path $scriptPath) {
        Write-Host "  Executando script SQL..." -ForegroundColor Yellow
        if (Test-Command "mysql") {
            try {
                Get-Content $scriptPath | mysql -u root
                Write-Host "Script SQL executado com sucesso" -ForegroundColor Green
            }
            catch {
                Write-Host "Aviso: Erro ao executar script SQL: $_" -ForegroundColor Yellow
                Write-Host "As migracoes do EF Core serao aplicadas automaticamente" -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "Aviso: mysql.exe nao encontrado no PATH" -ForegroundColor Yellow
            Write-Host "Voce precisara executar o script manualmente:" -ForegroundColor Yellow
            Write-Host "mysql -u root < $scriptPath" -ForegroundColor Cyan
        }
    }
}

# Funcao para aplicar migracoes do EF Core
function Apply-Migrations {
    Write-Host "Aplicando migracoes do Entity Framework..." -ForegroundColor Yellow
    try {
        Push-Location "Projeto2025_API"
        dotnet ef database update --project ..\InfraEstrutura\InfraEstrutura.csproj --startup-project Projeto2025_API.csproj 2>&1 | Out-Null
        $exitCode = $LASTEXITCODE
        Pop-Location
        
        if ($exitCode -eq 0) {
            Write-Host "Migracoes aplicadas com sucesso" -ForegroundColor Green
        }
        else {
            Write-Host "Aviso: Pode haver migracoes pendentes" -ForegroundColor Yellow
            Write-Host "Execute manualmente: dotnet ef database update" -ForegroundColor Cyan
        }
    }
    catch {
        Write-Host "Aviso: Erro ao aplicar migracoes: $_" -ForegroundColor Yellow
        Pop-Location
    }
}

# Funcao para verificar e instalar dependencias do frontend
function Initialize-Frontend {
    Write-Host "Verificando dependencias do frontend..." -ForegroundColor Yellow
    Push-Location "controle-estoque-frontend"
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "  Instalando dependencias do npm..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Dependencias do frontend instaladas" -ForegroundColor Green
            Pop-Location
            return $true
        }
        else {
            Write-Host "Erro ao instalar dependencias do frontend" -ForegroundColor Red
            Pop-Location
            return $false
        }
    }
    else {
        Write-Host "Dependencias do frontend ja estao instaladas" -ForegroundColor Green
        Pop-Location
        return $true
    }
}

# Funcao para build do projeto backend
function Build-Backend {
    Write-Host "Compilando projeto backend..." -ForegroundColor Yellow
    try {
        Push-Location "Projeto2025_API"
        dotnet build | Out-Null
        $exitCode = $LASTEXITCODE
        Pop-Location
        
        if ($exitCode -eq 0) {
            Write-Host "Backend compilado com sucesso" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "Erro ao compilar o backend" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Erro ao compilar: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Verificar pre-requisitos
Write-Host "Verificando pre-requisitos..." -ForegroundColor Cyan
Write-Host ""

$prereqsOk = $true

# Verificar .NET SDK
if (Test-Command "dotnet") {
    $dotnetVersion = dotnet --version
    Write-Host ".NET SDK encontrado: $dotnetVersion" -ForegroundColor Green
}
else {
    Write-Host ".NET SDK nao encontrado" -ForegroundColor Red
    Write-Host "  Instale o .NET 8.0 SDK: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    $prereqsOk = $false
}

# Verificar Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "Node.js nao encontrado" -ForegroundColor Red
    Write-Host "  Instale o Node.js: https://nodejs.org/" -ForegroundColor Yellow
    $prereqsOk = $false
}

# Verificar npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "npm encontrado: $npmVersion" -ForegroundColor Green
}
else {
    Write-Host "npm nao encontrado" -ForegroundColor Red
    $prereqsOk = $false
}

Write-Host ""

if (-not $prereqsOk) {
    Write-Host "Pre-requisitos nao atendidos. Por favor, instale as ferramentas necessarias." -ForegroundColor Red
    exit 1
}

# Verificar MySQL (opcional)
if (-not $SkipDbCheck) {
    Test-MySQLConnection
    Write-Host ""
}

# Restaurar dependencias do backend
Write-Host "Restaurando dependencias do backend..." -ForegroundColor Yellow
Push-Location "Projeto2025_API"
dotnet restore | Out-Null
Pop-Location
Write-Host "Dependencias restauradas" -ForegroundColor Green
Write-Host ""

# Inicializar banco de dados
if (-not $SkipDbCheck) {
    Initialize-Database
    Apply-Migrations
    Write-Host ""
}

# Build do backend
if (-not (Build-Backend)) {
    Write-Host "Falha ao compilar o backend. Corrija os erros e tente novamente." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Inicializar frontend
if (-not (Initialize-Frontend)) {
    Write-Host "Falha ao inicializar o frontend. Corrija os erros e tente novamente." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Se apenas build, parar aqui
if ($BuildOnly) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Build concluido com sucesso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para iniciar o projeto:" -ForegroundColor Yellow
    Write-Host "  Backend:  cd Projeto2025_API && dotnet run" -ForegroundColor Cyan
    Write-Host "  Frontend: cd controle-estoque-frontend && npm start" -ForegroundColor Cyan
    exit 0
}

# Iniciar aplicacao
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Inicializacao concluida!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar o projeto, execute:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend (em um terminal):" -ForegroundColor Cyan
Write-Host "   cd Projeto2025_API" -ForegroundColor White
Write-Host "   dotnet run" -ForegroundColor White
Write-Host ""
Write-Host "2. Frontend (em outro terminal):" -ForegroundColor Cyan
Write-Host "   cd controle-estoque-frontend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "Acesse:" -ForegroundColor Yellow
Write-Host "  - API: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciais:" -ForegroundColor Yellow
Write-Host "  Usuario: ana" -ForegroundColor White
Write-Host "  Senha: 123456" -ForegroundColor White
Write-Host ""
