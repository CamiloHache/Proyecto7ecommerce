import "./ProyectoSection.css";

const ProyectoSection = ({ icon, blocks }) => {
  const [definitionBlock, ...restBlocks] = blocks || [];

  return (
    <section id="proyecto" className="proyecto-section">
      <div className="proyecto-inner">
        {definitionBlock ? (
          <article className="proyecto-definition">
            <div className="proyecto-block-icon-wrap">
              <img src={icon} alt="" className="proyecto-block-icon" />
            </div>
            <h3 className="proyecto-block-title">{definitionBlock.title}</h3>
            <p className="proyecto-block-text">{definitionBlock.text}</p>
          </article>
        ) : null}

        <div className="proyecto-grid">
          {restBlocks.map((block, i) => (
            <article key={`${block.title}-${i}`} className="proyecto-block">
              <div className="proyecto-block-icon-wrap">
                <img src={icon} alt="" className="proyecto-block-icon" />
              </div>
              <h3 className="proyecto-block-title">{block.title}</h3>
              <p className="proyecto-block-text">{block.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProyectoSection;
