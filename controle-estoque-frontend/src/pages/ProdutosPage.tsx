import React, { useState, useEffect } from 'react';
import { Produto } from '../types';
import { produtoService } from '../services/api';
import ProdutoForm from '../components/ProdutoForm';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage, FiLoader } from 'react-icons/fi';

const ProdutosPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await produtoService.getAll();
      setProdutos(data);
    } catch (err: any) {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await produtoService.delete(id);
      setSuccessMessage('Produto excluído com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadProdutos();
    } catch (err: any) {
      setError('Erro ao excluir produto');
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduto(undefined);
    setSuccessMessage(editingProduto ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 3000);
    loadProdutos();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduto(undefined);
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria?.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container loading-container">
        <FiLoader className="spinner" />
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📦 Gerenciar Produtos</h1>
        <p>Controle seu inventário de forma eficiente</p>
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
              placeholder="Buscar produtos por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary btn-icon" onClick={() => setShowForm(true)}>
            <FiPlus /> Novo Produto
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Quantidade</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProdutos.map(produto => (
                <tr key={produto.id}>
                  <td><strong>#{produto.id}</strong></td>
                  <td><FiPackage style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {produto.descricao}</td>
                  <td className="money-text">R$ {produto.valor.toFixed(2)}</td>
                  <td>
                    <span className={`quantity-badge ${produto.quantidade < 10 ? 'low-stock' : ''}`}>
                      {produto.quantidade}
                    </span>
                  </td>
                  <td><span className="category-badge">{produto.categoria?.descricao || 'N/A'}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary btn-icon" 
                        onClick={() => handleEdit(produto)}
                        title="Editar produto"
                      >
                        <FiEdit2 /> Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger btn-icon" 
                        onClick={() => handleDelete(produto.id)}
                        title="Excluir produto"
                      >
                        <FiTrash2 /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProdutos.length === 0 && (
          <div className="empty-state">
            <FiPackage className="empty-icon" />
            <p>Nenhum produto encontrado.</p>
            {searchTerm && <p className="empty-hint">Tente buscar com outros termos.</p>}
          </div>
        )}

        {produtos.length > 0 && (
          <div className="summary-info">
            <p>Total de produtos: <strong>{produtos.length}</strong></p>
            {searchTerm && <p>Resultados da busca: <strong>{filteredProdutos.length}</strong></p>}
          </div>
        )}
      </div>

      {showForm && (
        <ProdutoForm
          produto={editingProduto}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default ProdutosPage;
