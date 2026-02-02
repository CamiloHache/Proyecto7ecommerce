import "./ProductCard.css";

const ProductCard = ({ image, title, description }) => {
  return (
    <div className="product-card">
      <div className="product-card-image-wrap">
        {image && <img src={image} alt={title} />}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProductCard;
