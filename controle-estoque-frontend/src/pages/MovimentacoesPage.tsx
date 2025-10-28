import React, { useState, useEffect } from 'react';
import { MovimentacaoEstoque, Produto } from '../types';
import { movimentacaoService, produtoService } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiLoader, FiTrendingUp } from 'react-icons/fi';

const MovimentacoesPage: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  
  const [formData, setFormData] = useState({
    idProduto: 0,
    tipo: 'Entrada',
    quantidade: 1,
    observacao: ''
  });

  useEffect(() => {
    loadMovimentacoes();
    loadProdutos();
  }, []);

  const loadMovimentacoes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await movimentacaoService.getAll();
      setMovimentacoes(data);
    } catch (err: any) {
      setError('Erro ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const loadProdutos = async () => {
    try {
      const data = await produtoService.getAll();
      setProdutos(data);
    } catch (err: any) {
      setError('Erro ao carregar produtos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.idProduto === 0) {
      setError('Selecione um produto');
      return;
    }

    if (formData.quantidade <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    try {
      setError('');
      await movimentacaoService.create(formData);
      setSuccessMessage('Movimentação registrada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowForm(false);
      setFormData({ idProduto: 0, tipo: 'Entrada', quantidade: 1, observacao: '' });
      loadMovimentacoes();
      loadProdutos(); // Atualizar estoque dos produtos
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao registrar movimentação');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta movimentação?')) {
      return;
    }

    try {
      await movimentacaoService.delete(id);
      setSuccessMessage('Movimentação excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadMovimentacoes();
      loadProdutos(); // Atualizar estoque dos produtos
    } catch (err: any) {
      setError('Erro ao excluir movimentação');
    }
  };

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchSearch = mov.produto?.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       mov.observacao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = filtroTipo === 'Todos' || mov.tipo === filtroTipo;
    return matchSearch && matchTipo;
  });

  if (loading) {
    return (
      <div className="container loading-container">
        <FiLoader className="spinner" />
        <p>Carregando movimentações...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📊 Movimentações de Estoque</h1>
        <p>Registre entradas e saídas de produtos</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-danger">
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            ✅ {successMessage}
          </div>
        )}

        <div className="search-bar">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar movimentações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="form-select"
            style={{ maxWidth: '150px' }}
          >
            <option value="Todos">Todos</option>
            <option value="Entrada">Entradas</option>
            <option value="Saída">Saídas</option>
          </select>

          <button className="btn btn-primary btn-icon" onClick={() => setShowForm(true)}>
            <FiPlus /> Nova Movimentação
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Observação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovimentacoes.map(mov => (
                <tr key={mov.id}>
                  <td>{new Date(mov.data).toLocaleString('pt-BR')}</td>
                  <td><FiPackage style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {mov.produto?.descricao || 'N/A'}</td>
                  <td>
                    <span className={`badge ${mov.tipo === 'Entrada' ? 'badge-success' : 'badge-danger'}`}>
                      {mov.tipo === 'Entrada' ? <FiTrendingUp /> : '⬇️'}
                      {' '}{mov.tipo}
                    </span>
                  </td>
                  <td><strong>{mov.quantidade}</strong></td>
                  <td>{mov.observacao || '-'}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-danger btn-icon" 
                      onClick={() => handleDelete(mov.id)}
                      title="Excluir movimentação"
                    >
                      <FiTrash2 /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovimentacoes.length === 0 && (
          <div className="empty-state">
            <FiPackage className="empty-icon" />
            <p>Nenhuma movimentação encontrada.</p>
            {searchTerm && <p className="empty-hint">Tente buscar com outros termos.</p>}
          </div>
        )}

        {movimentacoes.length > 0 && (
          <div className="summary-info">
            <p>Total de movimentações: <strong>{movimentacoes.length}</strong></p>
            {searchTerm && <p>Resultados da busca: <strong>{filteredMovimentacoes.length}</strong></p>}
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Movimentação</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="produto">Produto *</label>
                <select
                  id="produto"
                  value={formData.idProduto}
                  onChange={(e) => setFormData({ ...formData, idProduto: parseInt(e.target.value) })}
                  required
                  className="form-control"
                >
                  <option value="0">Selecione um produto</option>
                  {produtos.map(produto => (
                    <option key={produto.id} value={produto.id}>
                      {produto.descricao} - Estoque: {produto.quantidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo *</label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  required
                  className="form-control"
                >
                  <option value="Entrada">Entrada (Adicionar ao estoque)</option>
                  <option value="Saída">Saída (Retirar do estoque)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantidade">Quantidade *</label>
                <input
                  type="number"
                  id="quantidade"
                  min="1"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="observacao">Observação</label>
                <textarea
                  id="observacao"
                  value={formData.observacao}
                  onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                  className="form-control"
                  rows={3}
                  placeholder="Adicione uma observação (opcional)"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <FiPlus /> Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovimentacoesPage;

