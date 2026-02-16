import { useContext } from "react";
import { UserContext } from "../context/userContext";

const Perfil = () => {
  const { user } = useContext(UserContext);

  return (
    <section style={{ padding: "2rem 1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Mi perfil</h1>
      <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
        Esta es tu area privada de usuario.
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1rem",
          backgroundColor: "#fff",
        }}
      >
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Nombre:</strong> {user?.nombre || "No disponible"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "No disponible"}
        </p>
      </div>
    </section>
  );
};

export default Perfil;
