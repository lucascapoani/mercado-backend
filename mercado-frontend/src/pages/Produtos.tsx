import { useState, useEffect } from 'react';
import { produtosService } from '../services/produtos.service';
import { categoriasService } from '../services/categorias.service';
import type { Produto, CreateProdutoDto, Categoria } from '../types/index';
import './Produtos.css';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateProdutoDto>({
    nome: '',
    descricao: '',
    preco: 0,
    estoque: 0,
    categoriaId: 0,
    ativo: true,
  });
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [produtosData, categoriasData] = await Promise.all([
        produtosService.getAll(),
        categoriasService.getAll(),
      ]);
      setProdutos(produtosData);
      setCategorias(categoriasData);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim() || !formData.categoriaId) {
      setErro('Nome e categoria são obrigatórios');
      return;
    }

    try {
      if (editando) {
        await produtosService.update(editando, formData);
      } else {
        await produtosService.create(formData);
      }
      
      resetForm();
      carregarDados();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  const handleEditar = (produto: Produto) => {
    setEditando(produto.id);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      estoque: produto.estoque,
      categoriaId: produto.categoriaId,
      ativo: produto.ativo,
    });
  };

  const resetForm = () => {
    setEditando(null);
    setFormData({
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoriaId: 0,
      ativo: true,
    });
    setErro('');
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await produtosService.delete(id);
      carregarDados();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao excluir produto');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Gerenciar Produtos</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Produto' : 'Novo Produto'}</h2>
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
              <label htmlFor="categoriaId">Categoria:</label>
              <select
                id="categoriaId"
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: Number(e.target.value) })}
                required
              >
                <option value={0}>Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preco">Preço (R$):</label>
              <input
                type="number"
                id="preco"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estoque">Estoque:</label>
              <input
                type="number"
                id="estoque"
                value={formData.estoque}
                onChange={(e) => setFormData({ ...formData, estoque: Number(e.target.value) })}
                min="0"
                required
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
        <h2>Lista de Produtos</h2>
        {produtos.length === 0 ? (
          <p className="empty-message">Nenhum produto cadastrado</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria.nome}</td>
                  <td>R$ {Number(produto.preco).toFixed(2)}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    <span className={`badge ${produto.ativo ? 'badge-success' : 'badge-danger'}`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleEditar(produto)}
                      className="btn btn-small btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(produto.id)}
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
