import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/userContext";
import { ProductProvider } from "./context/productContext";
import { CartProvider } from "./context/cartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </React.StrictMode>
);
