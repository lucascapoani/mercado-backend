import api from './api';
import type { Categoria, CreateCategoriaDto } from '../types/index';

export const categoriasService = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get<Categoria[]>('/categorias');
    return response.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoriaDto): Promise<Categoria> => {
    const response = await api.post<Categoria>('/categorias', data);
    return response.data;
  },

  update: async (id: number, data: CreateCategoriaDto): Promise<Categoria> => {
    const response = await api.put<Categoria>(`/categorias/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
