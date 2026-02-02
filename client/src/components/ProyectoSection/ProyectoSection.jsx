import "./ProyectoSection.css";

const ProyectoSection = ({ icon, blocks }) => {
  return (
    <section id="proyecto" className="proyecto-section">
      <div className="proyecto-inner">
        <div className="proyecto-grid">
          {blocks.map((block, i) => (
            <div key={i} className="proyecto-block">
              <div className="proyecto-block-icon-wrap">
                <img src={icon} alt="" className="proyecto-block-icon" />
              </div>
              <h3 className="proyecto-block-title">{block.title}</h3>
              <p className="proyecto-block-text">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProyectoSection;
