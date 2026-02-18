import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/img/logo-wh3.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/">
            <img src={logo} alt="Memorice" className="footer-logo" />
          </Link>
          <p className="footer-tagline">
            Memoria histórica a través de objetos y experiencias culturales.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navegación</h4>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/login">Iniciar sesión</Link>
        </div>

        <div className="footer-contact">
          <h4>Contacto</h4>
          <p>contacto@memorice.cl</p>
          <p>Chile</p>
        </div>

        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="footer-social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="TikTok">TikTok</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Memorice. Todos los derechos reservados.</p>
        <p className="footer-credit">Desarrollado por Tiúke Studio</p>
      </div>
    </footer>
  );
};

export default Footer;
