import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService, produtoService } from '../services/api';
import { FiBox, FiGrid, FiTag, FiLogOut, FiTrendingUp, FiBell, FiActivity } from 'react-icons/fi';
import { API_CONFIG } from '../config';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    loadAlertCount();
    const interval = setInterval(loadAlertCount, API_CONFIG.ALERTS.AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const loadAlertCount = async () => {
    try {
      const produtos = await produtoService.getAll();
      const baixoEstoque = produtos.filter(p => p.quantidade < API_CONFIG.ALERTS.LOW_STOCK_THRESHOLD).length;
      setAlertCount(baixoEstoque);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <FiBox className="brand-icon" />
            <span>Controle de Estoque</span>
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link to="/" className={isActive('/')}>
                <FiGrid /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/produtos" className={isActive('/produtos')}>
                <FiTag /> Produtos
              </Link>
            </li>
            <li>
              <Link to="/movimentacoes" className={isActive('/movimentacoes')}>
                <FiActivity /> Movimentações
              </Link>
            </li>
            <li>
              <Link to="/categorias" className={isActive('/categorias')}>
                <FiTrendingUp /> Categorias
              </Link>
            </li>
            <li className="alert-badge-container">
              <Link to="/" className="alert-link">
                <FiBell className="alert-icon" />
                {alertCount > 0 && (
                  <span className="alert-badge">{alertCount}</span>
                )}
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="logout-btn"
              >
                <FiLogOut /> Sair
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
