import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetails from "./pages/ProductDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import OrderHistory from "./pages/OrderHistory";
import LoginForm from "./pages/Login";
import SignupPage from "./pages/Signup";
import OnboardingForm from "./pages/onboardingForm";
import "react-toastify/dist/ReactToastify.css";
import EcommerceAdminDashboard from "./pages/Admin/AddProducts";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<EcommerceAdminDashboard />} />
          <Route path="/order-history" element={<OrderHistory userId={"user1"} />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </CartProvider>
  );
}