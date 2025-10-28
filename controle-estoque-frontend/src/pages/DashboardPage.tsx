import React, { useState, useEffect } from 'react';
import { Produto } from '../types';
import { produtoService } from '../services/api';
import { FiPackage, FiDollarSign, FiAlertCircle, FiTrendingUp, FiLoader, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { API_CONFIG } from '../config';

const DashboardPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    valorTotalEstoque: 0,
    produtosBaixoEstoque: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await produtoService.getAll();
      setProdutos(data);

      // Calcular estatísticas
      const totalProdutos = data.length;
      const valorTotalEstoque = data.reduce((sum, produto) => sum + (produto.valor * produto.quantidade), 0);
      const produtosBaixoEstoque = data.filter(produto => produto.quantidade < API_CONFIG.ALERTS.LOW_STOCK_THRESHOLD).length;

      setStats({
        totalProdutos,
        valorTotalEstoque,
        produtosBaixoEstoque
      });
    } catch (err: any) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container loading-container">
        <FiLoader className="spinner" />
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  const produtosBaixoEstoque = produtos.filter(produto => produto.quantidade < API_CONFIG.ALERTS.LOW_STOCK_THRESHOLD);

  // Dados para gráficos
  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    const categoria = produto.categoria?.descricao || 'Sem Categoria';
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(produtosPorCategoria).map(([name, value]) => ({
    name,
    value,
    porcentagem: ((value / produtos.length) * 100).toFixed(1)
  }));

  // Dados para gráfico de barras - Top 5 produtos por valor
  const topProducts = produtos
    .sort((a, b) => (b.valor * b.quantidade) - (a.valor * a.quantidade))
    .slice(0, 5)
    .map(p => ({
      name: p.descricao,
      valor: p.valor * p.quantidade
    }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

  return (
    <div className="container">
      <div className="page-header">
        <h1>📊 Dashboard de Controle</h1>
        <p>Visão geral do seu estoque em tempo real</p>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <FiPackage />
          </div>
          <div className="stat-content">
            <h3>Total de Produtos</h3>
            <p className="stat-value">{stats.totalProdutos}</p>
          </div>
        </div>
        
        <div className="stat-card green">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>Valor Total do Estoque</h3>
            <p className="stat-value">R$ {stats.valorTotalEstoque.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card red">
          <div className="stat-icon">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>Baixo Estoque</h3>
            <p className="stat-value">{stats.produtosBaixoEstoque}</p>
          </div>
        </div>
      </div>

      {/* Alertas de Estoque Baixo */}
      {produtosBaixoEstoque.length > 0 && (
        <div className="alert-banner warning">
          <FiAlertCircle /> <strong>Atenção!</strong> {produtosBaixoEstoque.length} produto(s) com estoque baixo (menos de {API_CONFIG.ALERTS.LOW_STOCK_THRESHOLD} unidades)
        </div>
      )}

      {/* Visualização por Categoria */}
      <div className="card">
        <div className="card-header">
          <FiPieChart className="card-icon" />
          <h2>Distribuição por Categoria</h2>
        </div>
        <div className="category-distribution">
          {chartData.map((item, index) => (
            <div key={item.name} className="category-item">
              <div className="category-header">
                <span className="category-color" style={{ background: COLORS[index % COLORS.length] }}></span>
                <span className="category-name">{item.name}</span>
                <span className="category-value">{item.value} produtos ({item.porcentagem}%)</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-fill" 
                  style={{ 
                    width: `${item.porcentagem}%`, 
                    background: COLORS[index % COLORS.length] 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Produtos por Valor */}
      <div className="card">
        <div className="card-header">
          <FiBarChart2 className="card-icon" />
          <h2>Top 5 Produtos por Valor Total</h2>
        </div>
        <div className="top-products-list">
          {topProducts.map((produto, index) => (
            <div key={index} className="top-product-item">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <div className="product-name">{produto.name}</div>
                <div className="product-value">R$ {produto.valor.toFixed(2)}</div>
              </div>
              <div 
                className="value-bar" 
                style={{ 
                  width: `${(produto.valor / topProducts[0].valor) * 100}%` 
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Produtos com Baixo Estoque */}
      {produtosBaixoEstoque.length > 0 && (
        <div className="card">
          <div className="card-header warning">
            <FiAlertCircle className="card-icon" />
            <h2>Produtos com Baixo Estoque</h2>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade Atual</th>
                <th>Valor Unitário</th>
                <th>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {produtosBaixoEstoque.map(produto => (
                <tr key={produto.id}>
                  <td><strong>{produto.descricao}</strong></td>
                  <td className="warning-text">{produto.quantidade}</td>
                  <td>R$ {produto.valor.toFixed(2)}</td>
                  <td>{produto.categoria?.descricao || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Produtos Mais Caros */}
      <div className="card">
        <div className="card-header success">
          <FiTrendingUp className="card-icon" />
          <h2>Top 10 Produtos Mais Caros</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Valor</th>
              <th>Quantidade</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {produtos
              .sort((a, b) => b.valor - a.valor)
              .slice(0, 10)
              .map(produto => (
                <tr key={produto.id}>
                  <td><strong>{produto.descricao}</strong></td>
                  <td className="success-text">R$ {produto.valor.toFixed(2)}</td>
                  <td>{produto.quantidade}</td>
                  <td>{produto.categoria?.descricao || 'N/A'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
