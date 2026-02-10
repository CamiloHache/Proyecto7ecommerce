import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import logo from "../assets/img/logo-blk3.png";
import "./Login.css"; // Usa el mismo CSS si es compartido

const Signup = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <Link to="/"><img src={logo} alt="Logo" className="login-logo" /></Link>
        <h1>Crear cuenta</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login-submit">Registrarme</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;