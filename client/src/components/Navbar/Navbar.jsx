import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import logo from "../../assets/img/logo-blk3.png";

const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <path
      d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H7.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="19" r="1.6" fill="currentColor" />
    <circle cx="17" cy="19" r="1.6" fill="currentColor" />
  </svg>
);

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <path
      d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M5.5 19a6.5 6.5 0 0 1 13 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <path
      d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M15 16l5-4-5-4M20 12H9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon nav-search-icon">
    <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M16 16l4.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar = () => {
  const { token, user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header className="navbar-header">
      <div className="navbar-top">
        <Link to="/">
          <img src={logo} alt="Memorice logo" className="navbar-logo" />
        </Link>

        <div className="navbar-actions">
          <Link to="/cart" className="nav-btn nav-btn-outline">
            <CartIcon />
            <span>Carrito</span>
          </Link>

          <button
            type="button"
            className="nav-btn nav-btn-outline"
            onClick={() => navigate(token ? "/perfil" : "/login")}
          >
            {token ? <UserIcon /> : <LoginIcon />}
            {token ? `Hola ${user?.nombre || "usuario"}` : "Login"}
          </button>

          {!token ? (
            <Link to="/signup" className="nav-btn nav-btn-outline">
              Sign up
            </Link>
          ) : (
            <button
              type="button"
              className="nav-btn nav-btn-outline"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogoutIcon />
              Logout
            </button>
          )}

          {user?.rol === "admin" && (
            <Link to="/admin" className="nav-btn nav-btn-outline">
              Panel admin
            </Link>
          )}
          <div className="navbar-search-wrap">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar..."
              className="navbar-search"
            />
          </div>
        </div>
      </div>

      <nav className="nav-menu">
        <div className="nav-item">
          <span className="nav-link">QUIÉNES SOMOS</span>
          <div className="dropdown">
            <Link to="/proyecto-memorice">Proyecto Memorice</Link>
            <a href="/#proyecto">Definición, Misión, Visión, Valores</a>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">COLABORACIONES</span>
          <div className="dropdown">
            <Link to="/colaboraciones/mmdh">MMDH</Link>
            <Link to="/colaboraciones/sitios-memoria">Sitios de Memoria</Link>
            <Link to="/colaboraciones/argentina">Argentina</Link>
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
            <Link to="/contacto">Formulario</Link>
            <Link to="/prensa">Prensa</Link>
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
