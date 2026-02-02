import "./products.css";

const Products = () => {
  return (
    <section className="products">
      <h2>PRODUCTOS</h2>

      <div className="products-grid">
        {[1, 2, 3].map((item) => (
          <div className="product-card" key={item}>
            <img
              src="/src/assets/img/producto-demo.png"
              alt="Producto"
            />
            <h3>PIN DÓNDE ESTÁN</h3>
            <p>$7.900</p>
            <button>COMPRAR</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
