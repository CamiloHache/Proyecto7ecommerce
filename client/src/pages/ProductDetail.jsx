import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <section style={{ padding: "4rem" }}>
      <h1>Producto {id}</h1>
      <p>Descripción histórica del producto.</p>
      <button>Agregar al carrito</button>
    </section>
  );
};

export default ProductDetail;
