import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import logo from "../assets/img/logo-blk3.png";
import "./Login.css"; 

const Signup = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const result = await register(nombre, email, password);
    if (result.success) {
      alert("Registro exitoso. Ahora inicia sesión.");
      navigate("/login");
    } else {
      setError(result.msg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo-wrap">
          <img src={logo} alt="Logo" className="login-logo" />
        </Link>
        <h1>Crear cuenta</h1>
        <p className="login-intro">
          Regístrate para acceder a tu perfil, pedidos y contenido exclusivo.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>

          <label htmlFor="confirmPassword">Repite tu contraseña</label>
          <div className="password-field">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Ocultar" : "Ver"}
            </button>
          </div>

          <button type="submit" className="login-submit">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;