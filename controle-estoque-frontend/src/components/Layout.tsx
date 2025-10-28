import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, produtoService } from '../services/api';
import { FiPackage, FiLogOut, FiBell } from 'react-icons/fi';
import { Produto } from '../types';
import { API_CONFIG } from '../config';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState<Produto[]>([]);

  useEffect(() => {
    loadAlertCount();
    const interval = setInterval(loadAlertCount, API_CONFIG.ALERTS.AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const loadAlertCount = async () => {
    try {
      const produtos = await produtoService.getAll();
      const baixoEstoque = produtos.filter(p => p.quantidade < API_CONFIG.ALERTS.LOW_STOCK_THRESHOLD);
      setProdutosBaixoEstoque(baixoEstoque);
      setAlertCount(baixoEstoque.length);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleGoToProdutos = () => {
    navigate('/produtos');
    setShowNotifications(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <FiPackage className="brand-icon" />
            <span>Controle de Estoque</span>
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link to="/" className={isActive('/')}>
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link to="/produtos" className={isActive('/produtos')}>
                📦 Produtos
              </Link>
            </li>
            <li>
              <Link to="/movimentacoes" className={isActive('/movimentacoes')}>
                📈 Movimentações
              </Link>
            </li>
            <li>
              <Link to="/categorias" className={isActive('/categorias')}>
                🗂️ Categorias
              </Link>
            </li>
            <li>
              <Link to="/relatorios" className={isActive('/relatorios')}>
                📊 Relatórios
              </Link>
            </li>
            <li className="alert-badge-container">
              <button 
                className="alert-link"
                onClick={handleNotificationClick}
              >
                <FiBell className="alert-icon" />
                {alertCount > 0 && (
                  <span className="alert-badge">{alertCount}</span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Avisos de Estoque</h4>
                    <span className="close-btn" onClick={() => setShowNotifications(false)}>×</span>
                  </div>
                  
                  {produtosBaixoEstoque.length > 0 ? (
                    <>
                      <div className="notifications-list">
                        {produtosBaixoEstoque.map((produto) => (
                          <div 
                            key={produto.id} 
                            className="notification-item"
                            onClick={handleGoToProdutos}
                          >
                            <div className="notification-content">
                              <strong>{produto.descricao}</strong>
                              <p>Estoque: {produto.quantidade} unidades</p>
                            </div>
                            <span className="notification-arrow">→</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        className="notification-button"
                        onClick={handleGoToProdutos}
                      >
                        Ver Todos os Produtos
                      </button>
                    </>
                  ) : (
                    <div className="no-notifications">
                      ✓ Todos os produtos têm estoque normal
                    </div>
                  )}
                </div>
              )}
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                🚪 Sair
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
