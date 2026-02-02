import { Link } from "react-router-dom";
import "./Signup.css";
import logo from "../assets/img/logo-blk3.png";

const Signup = () => {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <Link to="/" className="signup-logo-wrap">
          <img src={logo} alt="Memorice" className="signup-logo" />
        </Link>
        <h1>Crear cuenta</h1>
        <p className="signup-intro">
          Regístrate para acceder a tu perfil, pedidos y contenido exclusivo.
        </p>

        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <label htmlFor="confirm">Confirmar contraseña</label>
          <input
            id="confirm"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <button type="submit" className="signup-submit">
            Registrarme
          </button>
        </form>

        <p className="signup-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="signup-link">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
