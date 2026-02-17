import "./ProyectoMemorice.css";

const ProyectoMemorice = () => {
  return (
    <section className="proyecto-page">
      <div className="proyecto-hero">
        <h1>Proyecto Memorice</h1>
        <p>
          Memorice nace para rescatar, preservar y difundir la memoria visual de la historia
          reciente de Chile mediante objetos culturales, investigación y diseño.
        </p>
      </div>

      <div className="proyecto-content">
        <article>
          <h2>Inicio del proyecto</h2>
          <p>
            El proyecto comenzó como una iniciativa de diseño independiente enfocada en símbolos
            y relatos gráficos de los años 70, 80 y 90. Con el tiempo, se convirtió en una
            plataforma cultural que conecta memoria, arte y educación.
          </p>
          <p>
            Hoy Memorice trabaja con colaboradores y comunidades para transformar archivo visual en
            experiencias contemporáneas que inviten a la conversación y reflexión.
          </p>
        </article>

        <div className="proyecto-media-grid">
          <img
            src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80"
            alt="Archivo histórico en mesa de trabajo"
          />
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80"
            alt="Equipo colaborando en diseño"
          />
        </div>
      </div>
    </section>
  );
};

export default ProyectoMemorice;
