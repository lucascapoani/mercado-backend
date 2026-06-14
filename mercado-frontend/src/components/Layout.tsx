import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <h1>Mercado Manager</h1>
          </Link>
          <ul className="nav-menu">
            <li>
              <Link to="/categorias" className="nav-link">
                Categorias
              </Link>
            </li>
            <li>
              <Link to="/produtos" className="nav-link">
                Produtos
              </Link>
            </li>
            <li>
              <Link to="/clientes" className="nav-link">
                Clientes
              </Link>
            </li>
            <li>
              <Link to="/pedidos" className="nav-link">
                Pedidos
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <footer className="footer">
        <p>© 2026 Mercado Manager - Sistema de Gerenciamento</p>
      </footer>
    </div>
  );
}
