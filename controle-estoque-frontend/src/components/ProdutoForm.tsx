import React, { useState } from 'react';
import { Produto } from '../types';
import { produtoService, categoriaService } from '../services/api';

interface ProdutoFormProps {
  produto?: Produto;
  onSave: () => void;
  onCancel: () => void;
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ produto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    descricao: produto?.descricao || '',
    valor: produto?.valor || 0,
    quantidade: produto?.quantidade || 0,
    idCategoria: produto?.idCategoria || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);

  React.useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await categoriaService.getAll();
        setCategorias(data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };
    loadCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (produto) {
        await produtoService.update({ ...produto, ...formData });
      } else {
        await produtoService.create(formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{produto ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button className="close" onClick={onCancel}>&times;</button>
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="descricao">Descrição:</label>
            <input
              type="text"
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
              maxLength={150}
            />
          </div>

          <div className="form-group">
            <label htmlFor="valor">Valor:</label>
            <input
              type="number"
              id="valor"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade:</label>
            <input
              type="number"
              id="quantidade"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoria:</label>
            <select
              id="categoria"
              value={formData.idCategoria}
              onChange={(e) => setFormData({ ...formData, idCategoria: parseInt(e.target.value) })}
              required
            >
              <option value={0}>Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.descricao}
                </option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoForm;
