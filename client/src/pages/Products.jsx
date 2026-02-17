import { useContext } from "react";
import { ProductContext } from "../context/productContext"; 
import ProductCard from "../components/ProductCard/ProductCard";
import "./Products.css";

const ProductsPage = () => {
  const { products, loadingProducts, productsError } = useContext(ProductContext);

  return (
    <section className="products-page">
      <div className="products-page-inner">
        <h1 className="text-3xl font-bold mb-4">Catálogo de productos</h1>
        <p className="products-page-intro">
          Objetos y diseños que conectan memoria, arte y cultura.
        </p>
        <div className="products-grid">
          {loadingProducts ? (
            <p className="text-center py-10">Cargando catálogo...</p>
          ) : productsError ? (
            <p className="text-center py-10">{productsError}</p>
          ) : products && products.length > 0 ? (
            products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))
          ) : (
            <p className="text-center py-10">No hay productos disponibles por ahora.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;