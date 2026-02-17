import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import logo from "../../assets/img/logo-blk3.png";

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
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  border: "2px solid #1f1f1c",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60%",
                    height: "2px",
                    backgroundColor: "#1f1f1c",
                  }}
                />
              </span>
              <span>Carrito</span>
            </span>
          </Link>

          <button
            type="button"
            className="nav-btn nav-btn-outline"
            onClick={() => navigate(token ? "/perfil" : "/login")}
          >
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
              Logout
            </button>
          )}

          {user?.rol === "admin" && (
            <Link to="/admin" className="nav-btn nav-btn-outline">
              Panel admin
            </Link>
          )}
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
