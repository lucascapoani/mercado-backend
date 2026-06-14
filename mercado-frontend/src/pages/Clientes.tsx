import { useState, useEffect } from 'react';
import { clientesService } from '../services/clientes.service';
import type { Cliente, CreateClienteDto } from '../types/index';
import './Clientes.css';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateClienteDto>({
    nome: '',
    email: '',
    telefone: '',
    ativo: true,
  });
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const dados = await clientesService.getAll();
      setClientes(dados);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.email.trim()) {
      setErro('Nome e email são obrigatórios');
      return;
    }

    try {
      if (editando) {
        await clientesService.update(editando, formData);
      } else {
        await clientesService.create(formData);
      }
      
      resetForm();
      carregarClientes();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  const handleEditar = (cliente: Cliente) => {
    setEditando(cliente.id);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone || '',
      ativo: cliente.ativo,
    });
  };

  const resetForm = () => {
    setEditando(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      ativo: true,
    });
    setErro('');
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      await clientesService.delete(id);
      carregarClientes();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao excluir cliente');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Gerenciar Clientes</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                maxLength={150}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefone">Telefone:</label>
              <input
                type="tel"
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ativo">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                />
                Ativo
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editando ? 'Atualizar' : 'Criar'}
            </button>
            {editando && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-card">
        <h2>Lista de Clientes</h2>
        {clientes.length === 0 ? (
          <p className="empty-message">Nenhum cliente cadastrado</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone || '-'}</td>
                  <td>
                    <span className={`badge ${cliente.ativo ? 'badge-success' : 'badge-danger'}`}>
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleEditar(cliente)}
                      className="btn btn-small btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(cliente.id)}
                      className="btn btn-small btn-delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
