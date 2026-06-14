import { useState, useEffect } from 'react';
import { categoriasService } from '../services/categorias.service';
import type { Categoria, CreateCategoriaDto } from '../types/index';
import './Categorias.css';

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateCategoriaDto>({ nome: '' });
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const dados = await categoriasService.getAll();
      setCategorias(dados);
      setErro('');
    } catch (error) {
      setErro('Erro ao carregar categorias');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      setErro('Nome da categoria é obrigatório');
      return;
    }

    try {
      if (editando) {
        await categoriasService.update(editando, formData);
      } else {
        await categoriasService.create(formData);
      }
      
      setFormData({ nome: '' });
      setEditando(null);
      carregarCategorias();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao salvar categoria');
    }
  };

  const handleEditar = (categoria: Categoria) => {
    setEditando(categoria.id);
    setFormData({ nome: categoria.nome });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormData({ nome: '' });
    setErro('');
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await categoriasService.delete(id);
      carregarCategorias();
      setErro('');
    } catch (error: any) {
      setErro(error.response?.data?.message || 'Erro ao excluir categoria');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <h1>Gerenciar Categorias</h1>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-card">
        <h2>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome da Categoria:</label>
            <input
              type="text"
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ nome: e.target.value })}
              placeholder="Ex: Bebidas"
              maxLength={100}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editando ? 'Atualizar' : 'Criar'}
            </button>
            {editando && (
              <button type="button" onClick={handleCancelar} className="btn btn-secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="list-card">
        <h2>Lista de Categorias</h2>
        {categorias.length === 0 ? (
          <p className="empty-message">Nenhuma categoria cadastrada</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{categoria.nome}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleEditar(categoria)}
                      className="btn btn-small btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExcluir(categoria.id)}
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
