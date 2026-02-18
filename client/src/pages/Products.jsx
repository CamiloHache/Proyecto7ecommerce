import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductContext } from "../context/productContext"; 
import ProductCard from "../components/ProductCard/ProductCard";
import "./Products.css";

const ProductsPage = () => {
  const { products, loadingProducts, productsError } = useContext(ProductContext);
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!query) return products || [];
    return (products || []).filter((p) => {
      const nombre = String(p.nombre || "").toLowerCase();
      const categoria = String(p.categoria || "").toLowerCase();
      const descripcion = String(p.descripcion || "").toLowerCase();
      return (
        nombre.includes(query) ||
        categoria.includes(query) ||
        descripcion.includes(query)
      );
    });
  }, [products, query]);

  return (
    <section className="products-page">
      <div className="products-page-inner">
        <h1 className="text-3xl font-bold mb-4">Catálogo de productos</h1>
        <p className="products-page-intro">
          Objetos y diseños que conectan memoria, arte y cultura.
        </p>
        {query ? (
          <p className="products-page-search-result">
            Mostrando {filteredProducts.length} resultado(s) para: <strong>"{query}"</strong>
          </p>
        ) : null}
        <div className="products-grid">
          {loadingProducts ? (
            <p className="text-center py-10">Cargando catálogo...</p>
          ) : productsError ? (
            <p className="text-center py-10">{productsError}</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))
          ) : (
            <p className="text-center py-10">
              {query
                ? "No encontramos productos con ese criterio de búsqueda."
                : "No hay productos disponibles por ahora."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;