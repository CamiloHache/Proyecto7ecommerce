import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext"; 
import logo from "../assets/img/logo-blk3.png";
import "./Login.css";

const Login = () => {
  // 1. Estados para capturar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // 2. Traemos la función login y el router
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // 3. Función que se ejecuta al dar click en "Entrar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      // Si todo sale bien, vamos al inicio
      navigate("/");
    } else {
      // Si el backend dice que hay error, lo mostramos
      setError(result.msg);
    }
  };

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

        {/* 4. Agregamos el onSubmit y mostramos el error si existe */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</p>}
          
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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