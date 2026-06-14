import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Bem-vindo ao Mercado Manager</h1>
        <p className="subtitle">Sistema de Gerenciamento de Mercado</p>
        
        <div className="features">
          <div className="feature-card">
            <h2>📦 Categorias</h2>
            <p>Organize seus produtos em categorias para melhor controle</p>
          </div>
          
          <div className="feature-card">
            <h2>🛒 Produtos</h2>
            <p>Gerencie produtos, preços e estoque em tempo real</p>
          </div>
          
          <div className="feature-card">
            <h2>👥 Clientes</h2>
            <p>Cadastre e mantenha informações dos seus clientes</p>
          </div>
          
          <div className="feature-card">
            <h2>📋 Pedidos</h2>
            <p>Controle pedidos com máquina de estados e validação de estoque</p>
          </div>
        </div>
      </div>
    </div>
  );
}
