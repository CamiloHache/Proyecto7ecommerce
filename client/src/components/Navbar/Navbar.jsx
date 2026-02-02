import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-blk3.png";

const Navbar = () => {
  return (
    <header className="navbar-header">
      <div className="navbar-top">
        <Link to="/">
          <img src={logo} alt="Memorice logo" className="navbar-logo" />
        </Link>

        <div className="navbar-actions">
          <Link to="/login" className="nav-btn nav-btn-outline">
            Login
          </Link>
          <Link to="/signup" className="nav-btn nav-btn-outline">
            Sign up
          </Link>
          <input
            type="text"
            placeholder="Buscar…"
            className="navbar-search"
          />
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-item">
          <span className="nav-link">QUIÉNES SOMOS</span>
          <div className="dropdown">
            <a href="/#proyecto">Proyecto Memorice</a>
            <a href="/#proyecto">Definición, Misión, Visión, Valores</a>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">COLABORACIONES</span>
          <div className="dropdown">
            <a href="#">MMDH</a>
            <a href="#">Sitios de Memoria</a>
            <a href="#">Argentina</a>
          </div>
        </div>

        <div className="nav-item">
          <Link to="/productos" className="nav-link">
            PRODUCTOS
          </Link>
          <div className="dropdown">
            <Link to="/productos">Ver catálogo</Link>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">CONTACTO</span>
          <div className="dropdown">
            <a href="#">Formulario</a>
            <a href="#">Prensa</a>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">SÍGUENOS</span>
          <div className="dropdown">
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar
