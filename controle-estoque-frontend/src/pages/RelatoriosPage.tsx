import React, { useState, useEffect } from 'react';
import { relatorioService } from '../services/api';
import { RelatorioMovimentacoes, RelatorioCategoriaItem, RelatorioProduto, RelatorioSintetico } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type TabType = 'sintetico' | 'movimentacoes' | 'categorias' | 'produtos';

export default function RelatoriosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sintetico');
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [dataFim, setDataFim] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const [relatorioSintetico, setRelatorioSintetico] = useState<RelatorioSintetico | null>(null);
  const [relatorioMovimentacoes, setRelatorioMovimentacoes] = useState<RelatorioMovimentacoes | null>(null);
  const [relatorioCategorias, setRelatorioCategorias] = useState<RelatorioCategoriaItem[]>([]);
  const [relatoriosProdutos, setRelatoriosProdutos] = useState<RelatorioProduto[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRelatorios = async () => {
    setLoading(true);
    setError('');
    try {
      const [sintetico, movimentacoes, categorias, produtos] = await Promise.all([
        relatorioService.getRelatorioSintetico(),
        relatorioService.getMovimentacoesPorPeriodo(dataInicio, dataFim),
        relatorioService.getCategoriaPorPeriodo(dataInicio, dataFim),
        relatorioService.getProdutoPorPeriodo(dataInicio, dataFim)
      ]);
      setRelatorioSintetico(sintetico);
      setRelatorioMovimentacoes(movimentacoes[0] || null);
      setRelatorioCategorias(categorias);
      setRelatoriosProdutos(produtos);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRelatorios();
  }, [dataInicio, dataFim]);

  const handleFiltrar = () => {
    loadRelatorios();
  };

  const exportarCSV = (data: any[], nome: string) => {
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nome}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Exportar PDF - Movimentações
  const exportarPDFMovimentacoes = () => {
    if (!relatorioMovimentacoes) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Controle de Estoque - Relatório de Movimentações', 15, 15);
    doc.setFontSize(10);
    doc.text(`Período: ${dataInicio} até ${dataFim}`, 15, 22);
    doc.text(`Data exportação: ${new Date().toLocaleDateString('pt-BR')}`, 15, 28);
    //Tabela
    const body = relatorioMovimentacoes.movimentacoes.map(mov => [
      mov.id,
      mov.produto?.descricao || '',
      mov.tipo,
      mov.quantidade,
      new Date(mov.data).toLocaleDateString('pt-BR'),
      mov.observacao || '-' 
    ]);
    (doc as any).autoTable({
      startY: 34,
      head:[['ID','Produto','Tipo','Quantidade','Data','Observação']],
      body,
      theme: 'grid',
    });
    doc.save(`relatorio_movimentacoes_${dataInicio}_a_${dataFim}.pdf`);
  };
  // Exportar PDF - Categorias
  const exportarPDFCategorias = () => {
    if (relatorioCategorias.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Controle de Estoque - Relatório por Categoria', 15, 15);
    doc.setFontSize(10);
    doc.text(`Período: ${dataInicio} até ${dataFim}`, 15, 22);
    doc.text(`Data exportação: ${new Date().toLocaleDateString('pt-BR')}`, 15, 28);
    //Tabela
    const body = relatorioCategorias.map(cat => [
      cat.nomeCategoria,
      cat.totalProdutos,
      cat.quantidadeTotalEstoque,
      `R$ ${cat.valorTotalEstoque.toFixed(2)}`
    ]);
    (doc as any).autoTable({
      startY: 34,
      head:[['Categoria','Produtos','Quantidade Total','Valor Total']],
      body,
      theme: 'grid',
    });
    doc.save(`relatorio_categorias_${dataInicio}_a_${dataFim}.pdf`);
  };
  // Exportar PDF - Produtos
  const exportarPDFProdutos = () => {
    if (relatoriosProdutos.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Controle de Estoque - Relatório de Produtos', 15, 15);
    doc.setFontSize(10);
    doc.text(`Período: ${dataInicio} até ${dataFim}`, 15, 22);
    doc.text(`Data exportação: ${new Date().toLocaleDateString('pt-BR')}`, 15, 28);
    //Tabela
    const body = relatoriosProdutos.map(prod => [
      prod.descricao,
      prod.categoria,
      prod.quantidade,
      `R$ ${prod.valor.toFixed(2)}`,
      `R$ ${prod.valorTotal.toFixed(2)}`,
      prod.status
    ]);
    (doc as any).autoTable({
      startY: 34,
      head:[['Produto','Categoria','Quantidade','Valor Unit.','Valor Total','Status']],
      body,
      theme: 'grid',
    });
    doc.save(`relatorio_produtos_${dataInicio}_a_${dataFim}.pdf`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Relatórios</h1>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Data Início</label>
              <input
                type="date"
                className="form-control"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Data Fim</label>
              <input
                type="date"
                className="form-control"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button
                className="btn btn-primary"
                onClick={handleFiltrar}
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Filtrar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="card">
        <div className="nav nav-tabs card-header">
          <button
            className={`nav-link ${activeTab === 'sintetico' ? 'active' : ''}`}
            onClick={() => setActiveTab('sintetico')}
          >
            <span>📊</span> Sintético
          </button>
          <button
            className={`nav-link ${activeTab === 'movimentacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('movimentacoes')}
          >
            <span>📈</span> Movimentações
          </button>
          <button
            className={`nav-link ${activeTab === 'categorias' ? 'active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            <span>📊</span> Categorias
          </button>
          <button
            className={`nav-link ${activeTab === 'produtos' ? 'active' : ''}`}
            onClick={() => setActiveTab('produtos')}
          >
            <span>📊</span> Produtos
          </button>
        </div>

        <div className="card-body">
          {/* Relatório Sintético */}
          {activeTab === 'sintetico' && relatorioSintetico && (
            <div className="relatorio-sintetico">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon">📦</div>
                    <div className="stats-content">
                      <span className="stats-label">Total de Produtos</span>
                      <div className="stats-value">{relatorioSintetico.totalProdutos}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{ color: '#e74c3c' }}>⚠️</div>
                    <div className="stats-content">
                      <span className="stats-label">Sem Estoque</span>
                      <div className="stats-value">{relatorioSintetico.produtosSemEstoque}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{ color: '#f39c12' }}>🔔</div>
                    <div className="stats-content">
                      <span className="stats-label">Estoque Baixo</span>
                      <div className="stats-value">{relatorioSintetico.produtosBaixoEstoque}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{ color: '#27ae60' }}>💰</div>
                    <div className="stats-content">
                      <span className="stats-label">Valor Total</span>
                      <div className="stats-value">R$ {relatorioSintetico.valorTotalEstoque.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon">📊</div>
                    <div className="stats-content">
                      <span className="stats-label">Movimentações Hoje</span>
                      <div className="stats-value">{relatorioSintetico.movimentacoesHoje}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{ color: '#27ae60' }}>📥</div>
                    <div className="stats-content">
                      <span className="stats-label">Entradas Hoje</span>
                      <div className="stats-value">{relatorioSintetico.entradasyHoje}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="stats-card">
                    <div className="stats-icon" style={{ color: '#e74c3c' }}>📤</div>
                    <div className="stats-content">
                      <span className="stats-label">Saídas Hoje</span>
                      <div className="stats-value">{relatorioSintetico.saidasHoje}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Relatório de Movimentações */}
          {activeTab === 'movimentacoes' && relatorioMovimentacoes && (
            <div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="stats-card">
                    <div className="stats-content">
                      <span className="stats-label">Total de Movimentações</span>
                      <div className="stats-value">{relatorioMovimentacoes.totalMovimentacoes}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stats-card">
                    <div className="stats-content">
                      <span className="stats-label">Total Entradas</span>
                      <div className="stats-value" style={{ color: '#27ae60' }}>{relatorioMovimentacoes.totalEntradas}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stats-card">
                    <div className="stats-content">
                      <span className="stats-label">Total Saídas</span>
                      <div className="stats-value" style={{ color: '#e74c3c' }}>{relatorioMovimentacoes.totalSaidas}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Movimentações Detalhadas</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => exportarCSV(relatorioMovimentacoes.movimentacoes, 'movimentacoes')}
                >
                  <span>⬇️</span> Exportar CSV
                </button>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={exportarPDFMovimentacoes}
                >
                  <span>⬇️</span> Exportar PDF
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Produto</th>
                      <th>Tipo</th>
                      <th>Quantidade</th>
                      <th>Data</th>
                      <th>Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatorioMovimentacoes.movimentacoes.map((mov) => (
                      <tr key={mov.id}>
                        <td>#{mov.id}</td>
                        <td>{mov.produto?.descricao || 'N/A'}</td>
                        <td>
                          <span className={`badge ${mov.tipo === 'Entrada' ? 'bg-success' : 'bg-danger'}`}>
                            {mov.tipo}
                          </span>
                        </td>
                        <td>{mov.quantidade}</td>
                        <td>{new Date(mov.data).toLocaleDateString('pt-BR')}</td>
                        <td>{mov.observacao || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Relatório por Categorias */}
          {activeTab === 'categorias' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Análise por Categoria</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => exportarCSV(
                    relatorioCategorias.map(c => ({
                      Categoria: c.nomeCategoria,
                      'Produtos': c.totalProdutos,
                      'Quantidade Total': c.quantidadeTotalEstoque,
                      'Valor Total': c.valorTotalEstoque
                    })),
                    'categorias'
                  )}
                >
                  <span>⬇️</span> Exportar CSV
                </button>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={exportarPDFCategorias}
                >
                  <span>⬇️</span> Exportar PDF
                </button>
              </div>

              <div className="row">
                {relatorioCategorias.map((categoria) => (
                  <div key={categoria.idCategoria} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title">{categoria.nomeCategoria}</h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted">Produtos</small>
                            <div className="fw-bold">{categoria.totalProdutos}</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">Quantidade</small>
                            <div className="fw-bold">{categoria.quantidadeTotalEstoque}</div>
                          </div>
                          <div className="col-12">
                            <small className="text-muted">Valor Total</small>
                            <div className="fw-bold" style={{ color: '#27ae60' }}>
                              R$ {categoria.valorTotalEstoque.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Relatório de Produtos */}
          {activeTab === 'produtos' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Análise Detalhada de Produtos</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => exportarCSV(relatoriosProdutos, 'produtos')}
                >
                  <span>⬇️</span> Exportar CSV
                </button>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={exportarPDFProdutos}
                >
                  <span>⬇️</span> Exportar PDF
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Quantidade</th>
                      <th>Valor Unit.</th>
                      <th>Valor Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatoriosProdutos.map((produto) => (
                      <tr key={produto.id}>
                        <td><strong>{produto.descricao}</strong></td>
                        <td>{produto.categoria}</td>
                        <td>{produto.quantidade}</td>
                        <td>R$ {produto.valor.toFixed(2)}</td>
                        <td className="fw-bold">R$ {produto.valorTotal.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${
                            produto.status === 'Normal' ? 'bg-success' :
                            produto.status === 'Estoque Baixo' ? 'bg-warning' :
                            'bg-danger'
                          }`}>
                            {produto.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
