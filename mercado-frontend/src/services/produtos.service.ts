import api from './api';
import type { Produto, CreateProdutoDto } from '../types/index';

export const produtosService = {
  getAll: async (): Promise<Produto[]> => {
    const response = await api.get<Produto[]>('/produtos');
    return response.data;
  },

  getById: async (id: number): Promise<Produto> => {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  create: async (data: CreateProdutoDto): Promise<Produto> => {
    const response = await api.post<Produto>('/produtos', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateProdutoDto>): Promise<Produto> => {
    const response = await api.put<Produto>(`/produtos/${id}`, data);
    return response.data;
  },

  updateEstoque: async (id: number, quantidade: number): Promise<Produto> => {
    const response = await api.patch<Produto>(`/produtos/${id}/estoque`, { quantidade });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/produtos/${id}`);
  },
};
