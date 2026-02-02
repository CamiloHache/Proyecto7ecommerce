import "./Section.css";

const Section = ({ title, text, alt, id, icon }) => {
  return (
    <section id={id} className={`section ${alt ? "alt" : ""}`}>
      <div className="section-box">
        <div className="section-header">
          {icon && <img src={icon} alt="" className="section-icon" />}
          <h2>{title}</h2>
        </div>
        <p>{text}</p>
      </div>
    </section>
  );
};

export default Section;
  