import api from './api';
import { StatusPedido } from '../types/index';
import type { Pedido, CreatePedidoDto } from '../types/index';

export const pedidosService = {
  getAll: async (): Promise<Pedido[]> => {
    const response = await api.get<Pedido[]>('/pedidos');
    return response.data;
  },

  getById: async (id: number): Promise<Pedido> => {
    const response = await api.get<Pedido>(`/pedidos/${id}`);
    return response.data;
  },

  create: async (data: CreatePedidoDto): Promise<Pedido> => {
    const response = await api.post<Pedido>('/pedidos', data);
    return response.data;
  },

  updateStatus: async (id: number, status: StatusPedido): Promise<Pedido> => {
    const response = await api.patch<Pedido>(`/pedidos/${id}/status`, { status });
    return response.data;
  },
};
