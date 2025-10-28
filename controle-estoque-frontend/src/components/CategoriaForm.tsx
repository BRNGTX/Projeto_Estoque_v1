import React, { useState } from 'react';
import { Categoria } from '../types';
import { categoriaService } from '../services/api';

interface CategoriaFormProps {
  categoria?: Categoria;
  onSave: () => void;
  onCancel: () => void;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ categoria, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    descricao: categoria?.descricao || '',
    descricaoDetalhada: categoria?.descricaoDetalhada || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (categoria) {
        await categoriaService.update({ ...categoria, ...formData });
      } else {
        await categoriaService.create(formData);
      }
      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{categoria ? 'Editar Categoria' : 'Nova Categoria'}</h2>
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
            <label htmlFor="descricaoDetalhada">Descrição Detalhada:</label>
            <textarea
              id="descricaoDetalhada"
              value={formData.descricaoDetalhada}
              onChange={(e) => setFormData({ ...formData, descricaoDetalhada: e.target.value })}
              required
              maxLength={500}
              rows={4}
            />
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

export default CategoriaForm;
