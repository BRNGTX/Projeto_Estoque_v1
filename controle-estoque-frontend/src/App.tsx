import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProdutosPage from './pages/ProdutosPage';
import CategoriasPage from './pages/CategoriasPage';
import MovimentacoesPage from './pages/MovimentacoesPage';
import RelatoriosPage from './pages/RelatoriosPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return authService.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/produtos" element={<ProdutosPage />} />
                  <Route path="/categorias" element={<CategoriasPage />} />
                  <Route path="/movimentacoes" element={<MovimentacoesPage />} />
                  <Route path="/relatorios" element={<RelatoriosPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
