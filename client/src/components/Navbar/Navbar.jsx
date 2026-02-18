import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
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

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <path
      d="M12 3l7 3v6c0 4.3-2.9 7.9-7 9-4.1-1.1-7-4.7-7-9V6l7-3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const SignupIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M3.5 19a5.5 5.5 0 0 1 11 0M17 8v6M14 11h6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
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

const MenuIcon = ({ isOpen }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="nav-icon">
    {isOpen ? (
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const Navbar = () => {
  const { token, user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const closeMobileMenu = () => setIsMenuOpen(false);
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    closeMobileMenu();
    if (!query) {
      navigate("/productos");
      return;
    }
    navigate(`/productos?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-top">
        <div className="navbar-brand-row">
          <Link to="/" onClick={closeMobileMenu} className="navbar-logo-link">
            <img src={logo} alt="Memorice logo" className="navbar-logo" />
          </Link>
          <button
            type="button"
            className="navbar-menu-toggle"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="nav-btn nav-btn-outline"
            onClick={() => {
              closeMobileMenu();
              navigate(token ? "/perfil" : "/login");
            }}
            aria-label={token ? "Ir a perfil" : "Ir a login"}
          >
            {token ? <UserIcon /> : <LoginIcon />}
            <span className="nav-btn-label">
              {token ? `Hola ${user?.nombre || "usuario"}` : "Login"}
            </span>
          </button>

          {token ? (
            <Link to="/cart" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
              <CartIcon />
              <span className="nav-btn-label">Carrito</span>
            </Link>
          ) : (
            <Link to="/signup" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
              <SignupIcon />
              <span className="nav-btn-label">Sign up</span>
            </Link>
          )}

          {token ? (
            <button
              type="button"
              className="nav-btn nav-btn-outline"
              onClick={() => {
                logout();
                closeMobileMenu();
                navigate("/");
              }}
              aria-label="Cerrar sesión"
            >
              <LogoutIcon />
              <span className="nav-btn-label">Logout</span>
            </button>
          ) : null}

          {token && user?.rol === "admin" && (
            <Link to="/admin" className="nav-btn nav-btn-outline" onClick={closeMobileMenu}>
              <AdminIcon />
              <span className="nav-btn-label">Panel admin</span>
            </Link>
          )}
          <form className="navbar-search-wrap" onSubmit={handleSearch}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar..."
              className="navbar-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar productos"
            />
          </form>
        </div>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? "is-open" : ""}`}>
        <div className="nav-item">
          <span className="nav-link">QUIÉNES SOMOS</span>
          <div className="dropdown">
            <Link to="/proyecto-memorice" onClick={closeMobileMenu}>
              Proyecto Memorice
            </Link>
            <a href="/#proyecto" onClick={closeMobileMenu}>
              Definición, Misión, Visión, Valores
            </a>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">COLABORACIONES</span>
          <div className="dropdown">
            <Link to="/colaboraciones/mmdh" onClick={closeMobileMenu}>
              MMDH
            </Link>
            <Link to="/colaboraciones/sitios-memoria" onClick={closeMobileMenu}>
              Sitios de Memoria
            </Link>
            <Link to="/colaboraciones/argentina" onClick={closeMobileMenu}>
              Argentina
            </Link>
          </div>
        </div>

        <div className="nav-item">
          <Link to="/productos" className="nav-link" onClick={closeMobileMenu}>
            PRODUCTOS
          </Link>
          <div className="dropdown">
            <Link to="/productos" onClick={closeMobileMenu}>
              Ver catálogo
            </Link>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">CONTACTO</span>
          <div className="dropdown">
            <Link to="/contacto" onClick={closeMobileMenu}>
              Formulario
            </Link>
            <Link to="/prensa" onClick={closeMobileMenu}>
              Prensa
            </Link>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">SÍGUENOS</span>
          <div className="dropdown">
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar
