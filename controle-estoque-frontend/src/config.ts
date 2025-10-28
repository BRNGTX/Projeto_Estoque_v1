// Configurações globais da aplicação
export const API_CONFIG = {
  // URL base da API backend
  BASE_URL: 'http://localhost:5000/api',
  
  // URL base do frontend (para uso em links, redirecionamentos, etc)
  FRONTEND_URL: 'http://localhost:3000',
  
  // Timeout para requisições HTTP (em ms)
  TIMEOUT: 30000,
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  
  // Configurações de alertas
  ALERTS: {
    LOW_STOCK_THRESHOLD: 10, // Quantidade mínima para alerta de estoque baixo
    AUTO_REFRESH_INTERVAL: 30000 // Intervalo de atualização automática (30 segundos)
  }
};

// Variáveis de ambiente (podem ser configuradas via .env)
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.REACT_APP_API_URL || API_CONFIG.BASE_URL,
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || API_CONFIG.FRONTEND_URL
};

