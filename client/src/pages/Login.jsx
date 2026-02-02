import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../assets/img/logo-blk3.png";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo-wrap">
          <img src={logo} alt="Memorice" className="login-logo" />
        </Link>
        <h1>Iniciar sesión</h1>
        <p className="login-intro">
          Ingresa con tu cuenta para acceder a tu perfil y pedidos.
        </p>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
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
            autoComplete="current-password"
          />

          <button type="submit" className="login-submit">
            Entrar
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/signup" className="login-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
