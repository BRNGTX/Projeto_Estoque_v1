# 📋 Configurações do Sistema

Este documento descreve as variáveis globais e configurações do sistema de Controle de Estoque.

## 🔧 Variáveis Globais

### Frontend (`src/config.ts`)

#### API_CONFIG
Configurações principais da aplicação:

```typescript
{
  BASE_URL: 'http://localhost:5000/api',      // URL da API backend
  FRONTEND_URL: 'http://localhost:3000',      // URL do frontend
  TIMEOUT: 30000,                              // Timeout das requisições (30s)
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,                     // Tamanho padrão de páginas
    MAX_PAGE_SIZE: 100                          // Tamanho máximo de páginas
  },
  
  ALERTS: {
    LOW_STOCK_THRESHOLD: 10,                   // Limite para estoque baixo
    AUTO_REFRESH_INTERVAL: 30000               // Intervalo de atualização (30s)
  }
}
```

#### ENV
Variáveis de ambiente:

```typescript
{
  NODE_ENV: 'development',                     // Ambiente da aplicação
  API_URL: 'http://localhost:5000/api',       // URL da API (pode ser sobrescrita)
  FRONTEND_URL: 'http://localhost:3000'        // URL do frontend
}
```

### Backend (`appsettings.json`)

#### URLs
Configuração das URLs do sistema:
```json
{
  "Urls": {
    "Backend": "http://localhost:5000",
    "Frontend": "http://localhost:3000"
  }
}
```

#### ApiSettings
Configurações da API:
```json
{
  "ApiSettings": {
    "BaseUrl": "http://localhost:5000/api",
    "Timeout": 30000
  }
}
```

#### CORS
Origins permitidos para CORS:
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001"
    ]
  }
}
```

## 🚀 Como Usar

### No Frontend

Importe as configurações no início do arquivo:
```typescript
import { API_CONFIG, ENV } from '../config';

// Usar timeout padrão
const timeout = API_CONFIG.TIMEOUT;

// Usar URL da API
const apiUrl = ENV.API_URL;

// Usar limite de estoque baixo
const threshold = API_CONFIG.ALERTS.LOW_STOCK_THRESHOLD;
```

### No Backend

No arquivo `Program.cs`, você pode acessar as configurações:
```csharp
var apiSettings = configuration.GetSection("ApiSettings");
var baseUrl = apiSettings["BaseUrl"];
var timeout = apiSettings["Timeout"];
```

## 🔄 Alterando as URLs

### Desenvolvimento
Para mudar a porta do backend, edite `Projeto2025_API/Properties/launchSettings.json`.

Para mudar a porta do frontend, edite `controle-estoque-frontend/package.json`.

### Produção
Crie arquivos `.env` no frontend ou use variáveis de ambiente do sistema operacional.

**Frontend:** `.env`
```
REACT_APP_API_URL=https://api.exemplo.com/api
REACT_APP_FRONTEND_URL=https://app.exemplo.com
```

**Backend:** Variáveis de ambiente
```bash
Urls__Backend=https://api.exemplo.com
Urls__Frontend=https://app.exemplo.com
```

## 📝 Notas

- As URLs são fixas em desenvolvimento (localhost:3000 e localhost:5000)
- O sistema usa portas estáticas para evitar conflitos
- Timeout padrão é de 30 segundos
- Alertas de estoque baixo são ativados quando quantidade < 10

