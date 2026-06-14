import { useState, useEffect } from 'react';
import { pedidosService } from '../services/pedidos.service';
import { clientesService } from '../services/clientes.service';
import { produtosService } from '../services/produtos.service';
import { StatusPedido } from '../types/index';
import type { Pedido, CreatePedidoDto, ItemPedido, Cliente, Produto } from '../types/index';
import './Pedidos.css';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreatePedidoDto>({
    clienteId: 0,
    itens: [],
  });
  const [itemAtual, setItemAtual] = useState<ItemPedido>({
    produtoId: 0,
    quantidade: 1,
  });
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [pedidosData, clientesData, produtosData] = await Promise.all([
        pedidosService.getAll(),
        clientesService.getAll(),
        produtosService.getAll(),
      ]);
      setPedidos(pedidosData);
      setClientes(clientesData.filter(c => c.ativo));
      setProdutos(produtosData.filter(p => p.ativo));
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = () => {
    if (!itemAtual.produtoId || itemAtual.quantidade <= 0) {
      setErro('Selecione um produto e quantidade válida');
      return;
    }

    const produto = produtos.find(p => p.id === itemAtual.produtoId);
    if (!produto) return;

    if (itemAtual.quantidade > produto.estoque) {
      setErro(`Estoque insuficiente. Disponível: ${produto.estoque}`);
      return;
    }

    const itemExistente = formData.itens.find(i => i.produtoId === itemAtual.produtoId);
    if (itemExistente) {
      setErro('Produto já adicionado ao pedido');
      return;
    }

    setFormData({
      ...formData,
      itens: [...formData.itens, { ...itemAtual }],
    });
    setItemAtual({ produtoId: 0, quantidade: 1 });
    setErro('');
  };

  const removerItem = (produtoId: number) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter(i => i.produtoId !== produtoId),
    });
  };

  const calcularTotal = () => {
    return formData.itens.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return total + (produto ? Number(produto.preco) * item.quantidade : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId || formData.itens.length === 0) {
      setErro('Selecione um cliente e adicione ao menos um item');
      return;
    }

    try {
      await pedidosService.create(formData);
      resetForm();
      carregarDados();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao criar pedido');
    }
  };

  const atualizarStatus = async (id: number, status: StatusPedido) => {
    try {
      await pedidosService.updateStatus(id, status);
      carregarDados();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  const resetForm = () => {
    setFormData({ clienteId: 0, itens: [] });
    setItemAtual({ produtoId: 0, quantidade: 1 });
    setErro('');
  };

  const getStatusBadgeClass = (status: StatusPedido) => {
    switch (status) {
      case StatusPedido.ABERTO: return 'badge-warning';
      case StatusPedido.CONFIRMADO: return 'badge-info';
      case StatusPedido.ENTREGUE: return 'badge-success';
      case StatusPedido.CANCELADO: return 'badge-danger';
      default: return '';
    }
  };

  const getProximosStatus = (statusAtual: StatusPedido): StatusPedido[] => {
    switch (statusAtual) {
      case StatusPedido.ABERTO:
        return [StatusPedido.CONFIRMADO, StatusPedido.CANCELADO];
      case StatusPedido.CONFIRMADO:
        return [StatusPedido.ENTREGUE, StatusPedido.CANCELADO];
      default:
        return [];
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Gerenciar Pedidos</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>Novo Pedido</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clienteId">Cliente:</label>
            <select
              id="clienteId"
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: Number(e.target.value) })}
              required
            >
              <option value={0}>Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.email}
                </option>
              ))}
            </select>
          </div>

          <div className="itens-section">
            <h3>Itens do Pedido</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="produtoId">Produto:</label>
                <select
                  id="produtoId"
                  value={itemAtual.produtoId}
                  onChange={(e) => setItemAtual({ ...itemAtual, produtoId: Number(e.target.value) })}
                >
                  <option value={0}>Selecione um produto</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} - R$ {Number(produto.preco).toFixed(2)} (Estoque: {produto.estoque})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quantidade">Quantidade:</label>
                <input
                  type="number"
                  id="quantidade"
                  value={itemAtual.quantidade}
                  onChange={(e) => setItemAtual({ ...itemAtual, quantidade: Number(e.target.value) })}
                  min="1"
                />
              </div>

              <button type="button" onClick={adicionarItem} className="btn btn-secondary">
                Adicionar Item
              </button>
            </div>

            {formData.itens.length > 0 && (
              <div className="itens-lista">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Preço Unit.</th>
                      <th>Subtotal</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.itens.map((item) => {
                      const produto = produtos.find(p => p.id === item.produtoId);
                      const subtotal = produto ? Number(produto.preco) * item.quantidade : 0;
                      return (
                        <tr key={item.produtoId}>
                          <td>{produto?.nome}</td>
                          <td>{item.quantidade}</td>
                          <td>R$ {produto ? Number(produto.preco).toFixed(2) : '0.00'}</td>
                          <td>R$ {subtotal.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removerItem(item.produtoId)}
                              className="btn btn-small btn-delete"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="total-row">
                      <td colSpan={3}><strong>Total:</strong></td>
                      <td colSpan={2}><strong>R$ {calcularTotal().toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={formData.itens.length === 0}>
              Criar Pedido
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Limpar
            </button>
          </div>
        </form>
      </div>

      <div className="list-card">
        <h2>Lista de Pedidos</h2>
        {pedidos.length === 0 ? (
          <p className="empty-message">Nenhum pedido cadastrado</p>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-header">
                  <h3>Pedido #{pedido.id}</h3>
                  <span className={`badge ${getStatusBadgeClass(pedido.status)}`}>
                    {pedido.status}
                  </span>
                </div>
                
                <div className="pedido-info">
                  <p><strong>Cliente:</strong> {pedido.cliente?.nome || `ID ${pedido.clienteId}`}</p>
                  <p><strong>Total:</strong> R$ {Number(pedido.total).toFixed(2)}</p>
                  <p><strong>Itens:</strong> {pedido.itens.length}</p>
                  {pedido.createdAt && (
                    <p><strong>Data:</strong> {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
                  )}
                </div>

                <div className="pedido-itens">
                  <h4>Itens:</h4>
                  <ul>
                    {pedido.itens.map((item, index) => (
                      <li key={index}>
                        Produto ID {item.produtoId} - Quantidade: {item.quantidade}
                        {item.precoUnitario && ` - R$ ${Number(item.precoUnitario).toFixed(2)}`}
                      </li>
                    ))}
                  </ul>
                </div>

                {getProximosStatus(pedido.status).length > 0 && (
                  <div className="pedido-actions">
                    <strong>Atualizar status:</strong>
                    {getProximosStatus(pedido.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => atualizarStatus(pedido.id, status)}
                        className={`btn btn-small ${status === StatusPedido.CANCELADO ? 'btn-delete' : 'btn-primary'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
