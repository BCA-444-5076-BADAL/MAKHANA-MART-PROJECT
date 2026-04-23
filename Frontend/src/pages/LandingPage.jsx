import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp, FaInstagram, FaFacebook, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
const API_URL = "http://localhost:5000/api/admin/products";
const API_IMAGE_URL = "http://localhost:5000/";

const LandingPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProduct, setNotificationProduct] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    }
  }, []);

  // Add to cart function
  const addToCart = (product) => {
    const savedCart = localStorage.getItem("cartItems");
    let cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cartItems.findIndex(item => item.id === product.id);
    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalCount);

    setNotificationProduct(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Cart Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeInOut flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {notificationProduct?.productName} added to cart!
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
  {/* Logo Image */}
  <img 
    src="https://img.freepik.com/premium-photo/makhana-also-called-as-lotus-seeds-fox-nuts-are-popular-dry-snacks-from-india-served-bowl-selective-focus_466689-19095.jpg" 
    alt="Makhana Mart Logo" 
    className="w-10 h-10 rounded-full object-cover border-2 border-green-700"
  />
  {/* Brand Name */}
  <div className="text-2xl font-bold text-green-700">
    Makhana Mart
  </div>
</div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-green-700 transition-colors">Home</a>

              {localStorage.getItem("user") ? (
                <button
                  onClick={() => { localStorage.removeItem("user"); window.location.reload(); }}
                  className="text-gray-600 font-bold hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <a href="/login" className="text-gray-600 font-bold hover:text-green-700 transition-colors">Login</a>
                  <a href="/signup" className="text-gray-600 font-bold hover:text-green-700 transition-colors">SignUp</a>
                </>
              )}

              <Link to="/products" className="text-gray-600 hover:text-green-700 transition-colors">Products</Link>
              <Link to="/cart" className="text-gray-600 hover:text-green-700 transition-colors">Cart</Link>
            </nav>

            <div className="relative">
              <a href="/cart">
                <button className="p-2 rounded-full hover:bg-green-100 transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {/* Hero Section with Animated Background Images */}
   {/* Hero Section with Animated Background Images + Left Contact Number */}
<section className="relative w-screen h-screen flex items-center justify-center overflow-hidden text-white">
  {/* Animated Background Images */}
  {[image1, image2, image3].map((img, index) => (
    <motion.img
      key={index}
      src={img}
      alt={`Background ${index + 1}`}
      className="absolute w-full h-full object-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "mirror",
        delay: index * 4, // each image fades in/out one by one
      }}
    />
  ))}

  {/* Left Contact Number */}
  <div className="absolute left-8 top-1/8 transform -translate-y-1/2 bg-green-600 bg-opacity-70 px-4 py-2 rounded-lg text-white font-bold shadow-lg z-20">
     Badal Kumar
    📞 9102397434
  </div>

  {/* Center Overlay Content */}
  <div className="relative z-10 text-center bg-yellow-900 bg-opacity-40 p-10 rounded-lg">
    <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">
      Welcome to Makhana Mart
    </h1>
    <p className="text-xl md:text-2xl mb-8 animate-fadeIn delay-200">
      Delicious and healthy snacks delivered to your doorstep
    </p>
    <button className="bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transform hover:scale-105 transition-all duration-300 animate-fadeIn delay-400">
      Shop Now
    </button>
  </div>
</section>
      {/* Featured Products */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Carefully selected healthy snacks for your wellness</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-500 group">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={`${API_IMAGE_URL}uploads/${product.productImage}`}
                  alt={product.productName}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.productName}</h3>
                <p className="text-xl font-bold text-green-600 mb-2">₹{product.productPrice}</p>
                <p className={`text-sm font-medium mb-4 ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  state={{ product }}
                  className="block w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300 text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={product.stock > 0 ? () => addToCart(product) : undefined}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center ${
                    product.stock > 0
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"Fresh Makhana, quick delivery and excellent quality. Loved it!"</p>
              <h4 className="font-semibold">- Priya Sharma</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"Healthy snacking made easy. My go-to snack store!"</p>
              <h4 className="font-semibold">- Rohit Verma</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">"Makhana Mart never disappoints. Highly recommend!"</p>
              <h4 className="font-semibold">- Anjali Singh</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Subscribe to get exclusive offers and updates on new products</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-500 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-green-600 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
<footer className="bg-gray-800 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Brand Info + Social Icons */}
      <div>
        <h3 className="text-xl font-bold mb-4">Makhana Mart</h3>
        <p className="text-gray-400">Your trusted source for healthy snacks</p>
        <div className="flex space-x-4 mt-4">
          <a href="https://wa.me/9102397434" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
            <FaWhatsapp />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
            <FaFacebook />
          </a>
          <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl">
            <FaGoogle />
          </a>
        </div>
      </div>

      {/* Shop Links */}
      <div>
        <h4 className="font-semibold mb-4">Shop</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sale</a></li>
        </ul>
      </div>

      {/* Company Links */}
      <div>
        <h4 className="font-semibold mb-4">Company</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
        </ul>
      </div>

      {/* Support + Contact */}
      <div>
        <h4 className="font-semibold mb-4">Support</h4>
        <ul className="space-y-2">
          <li className="text-gray-400">📞 9102397434</li>
          <li className="text-gray-400">✉️ badal@gmail.com</li>
          <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
        </ul>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
      <p>© 2025 Makhana Mart. All rights reserved.</p>
    </div>
  </div>
</footer>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          20%, 80% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-fadeInOut { animation: fadeInOut 2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LandingPage;