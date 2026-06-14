export interface Categoria {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  categoria: Categoria;
  categoriaId: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  ativo: boolean;
}

export enum StatusPedido {
  ABERTO = 'ABERTO',
  CONFIRMADO = 'CONFIRMADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export interface ItemPedido {
  produtoId: number;
  quantidade: number;
  precoUnitario?: number;
  subtotal?: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  cliente?: Cliente;
  status: StatusPedido;
  total: number;
  itens: ItemPedido[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoriaDto {
  nome: string;
}

export interface CreateProdutoDto {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoriaId: number;
  ativo?: boolean;
}

export interface CreateClienteDto {
  nome: string;
  email: string;
  telefone?: string;
  ativo?: boolean;
}

export interface CreatePedidoDto {
  clienteId: number;
  itens: ItemPedido[];
}
