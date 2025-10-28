import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Usuario } from '../types';
import { authService } from '../services/api';
import { FiUser, FiLock, FiLogIn, FiBox } from 'react-icons/fi';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<Usuario>({
    user: '',
    Senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.access_token);
      navigate('/');
    } catch (err: any) {
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <FiBox />
          </div>
          <h2>Controle de Estoque</h2>
          <p>Faça login para continuar</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            <FiLock /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">
              <FiUser className="input-icon" /> Usuário
            </label>
            <input
              type="text"
              id="user"
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              <FiLock className="input-icon" /> Senha
            </label>
            <input
              type="password"
              id="senha"
              value={formData.Senha}
              onChange={(e) => setFormData({ ...formData, Senha: e.target.value })}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span> Entrando...
              </>
            ) : (
              <>
                <FiLogIn /> Entrar
              </>
            )}
          </button>
        </form>

        <div className="login-credentials">
          <p><strong>Credenciais de Teste:</strong></p>
          <div className="credential-box">
            <p>👤 Usuário: <strong>ana</strong></p>
            <p>🔑 Senha: <strong>123456</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
