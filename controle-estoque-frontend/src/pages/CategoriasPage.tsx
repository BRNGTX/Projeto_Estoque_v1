import React, { useState, useEffect } from 'react';
import { Categoria } from '../types';
import { categoriaService } from '../services/api';
import CategoriaForm from '../components/CategoriaForm';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTag, FiLoader } from 'react-icons/fi';

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (err: any) {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await categoriaService.delete(id);
      setSuccessMessage('Categoria excluída com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadCategorias();
    } catch (err: any) {
      setError('Erro ao excluir categoria');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingCategoria(undefined);
    setSuccessMessage(editingCategoria ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
    setTimeout(() => setSuccessMessage(''), 3000);
    loadCategorias();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategoria(undefined);
  };

  const filteredCategorias = categorias.filter(cat =>
    cat.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.descricaoDetalhada.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container loading-container">
        <FiLoader className="spinner" />
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>🏷️ Gerenciar Categorias</h1>
        <p>Organize seus produtos por categorias</p>
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
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn btn-primary btn-icon" onClick={() => setShowForm(true)}>
            <FiPlus /> Nova Categoria
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Descrição Detalhada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map(categoria => (
                <tr key={categoria.id}>
                  <td><strong>#{categoria.id}</strong></td>
                  <td><FiTag style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {categoria.descricao}</td>
                  <td>{categoria.descricaoDetalhada}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary btn-icon" 
                        onClick={() => handleEdit(categoria)}
                        title="Editar categoria"
                      >
                        <FiEdit2 /> Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger btn-icon" 
                        onClick={() => handleDelete(categoria.id)}
                        title="Excluir categoria"
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

        {filteredCategorias.length === 0 && (
          <div className="empty-state">
            <FiTag className="empty-icon" />
            <p>Nenhuma categoria encontrada.</p>
            {searchTerm && <p className="empty-hint">Tente buscar com outros termos.</p>}
          </div>
        )}

        {categorias.length > 0 && (
          <div className="summary-info">
            <p>Total de categorias: <strong>{categorias.length}</strong></p>
            {searchTerm && <p>Resultados da busca: <strong>{filteredCategorias.length}</strong></p>}
          </div>
        )}
      </div>

      {showForm && (
        <CategoriaForm
          categoria={editingCategoria}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default CategoriasPage;
