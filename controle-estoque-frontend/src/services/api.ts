import axios from 'axios';
import { Categoria, Produto, Usuario, LoginResponse, PagedResult } from '../types';
import { ENV, API_CONFIG } from '../config';

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(usuario: Usuario): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/Seguranca', usuario);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};

export const categoriaService = {
  async getAll(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>('/Categoria');
    return response.data;
  },

  async getById(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/Categoria/${id}`);
    return response.data;
  },

  async create(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const response = await api.post<Categoria>('/Categoria', categoria);
    return response.data;
  },

  async update(categoria: Categoria): Promise<void> {
    await api.put('/Categoria', categoria);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Categoria/${id}`);
  },

  async search(nome: string): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>(`/Categoria/${nome}`);
    return response.data;
  }
};

export const produtoService = {
  async getAll(): Promise<Produto[]> {
    const response = await api.get<Produto[]>('/Produto');
    return response.data;
  },

  async getById(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`/Produto/${id}`);
    return response.data;
  },

  async create(produto: Omit<Produto, 'id'>): Promise<Produto> {
    const response = await api.post<Produto>('/Produto', produto);
    return response.data;
  },

  async update(produto: Produto): Promise<void> {
    await api.put('/Produto', produto);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Produto/${id}`);
  },

  async search(nome: string): Promise<Produto[]> {
    const response = await api.get<Produto[]>(`/Produto/${nome}`);
    return response.data;
  }
};
