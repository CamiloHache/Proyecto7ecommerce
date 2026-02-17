import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Perfil from "./pages/Perfil";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import ProyectoMemorice from "./pages/ProyectoMemorice";
import ColaboracionDetalle from "./pages/ColaboracionDetalle";
import Contacto from "./pages/Contacto";
import Prensa from "./pages/Prensa";
import OrderDetail from "./pages/OrderDetail";
import { UserContext } from "./context/userContext";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(UserContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useContext(UserContext);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.rol !== "admin") return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<Success />} />
            <Route path="/proyecto-memorice" element={<ProyectoMemorice />} />
            <Route path="/colaboraciones/:slug" element={<ColaboracionDetalle />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/prensa" element={<Prensa />} />
            <Route
              path="/ventas/:id"
              element={
                <AdminRoute>
                  <OrderDetail />
                </AdminRoute>
              }
            />
            <Route
              path="/mis-compras/:id"
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
