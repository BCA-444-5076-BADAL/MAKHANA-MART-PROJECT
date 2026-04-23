import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api/admin/products";
const API_IMAGE_URL = "http://localhost:5000/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/600x600?text=Product+Image";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(PLACEHOLDER_IMAGE);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const stateProduct = location.state?.product;
      if (stateProduct) {
        setProduct(stateProduct);
        return;
      }

      if (!id) {
        return;
      }

      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        const loadedProduct = data.product || data || null;
        if (loadedProduct) {
          setProduct(loadedProduct);
        }
      } catch (error) {
        console.error("Error loading product details:", error);
      }
    };

    loadProduct();
  }, [id, location.state]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const images =
      product.images?.length > 0
        ? product.images
        : product.productImage
        ? [`${API_IMAGE_URL}uploads/${product.productImage}`]
        : [];

    setSelectedImage(images[0] || PLACEHOLDER_IMAGE);
  }, [product]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
    }
  }, []);

  useEffect(() => {
    if (quantity < 1) {
      setQuantity(0);
    }
  }, [quantity]);

  const handleAddToCart = () => {
    const safeQuantity = Math.max(1, quantity);
    const savedCart = localStorage.getItem("cartItems");
    let cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    if (existingIndex >= 1) {
      cartItems[existingIndex].quantity += safeQuantity;
    } else {
      cartItems.push({ ...product, quantity: safeQuantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalCount);
    setQuantity(0);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const increaseQuantity = () => setQuantity((prev) => Math.max(1, prev + 1));
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
          <p className="text-xl font-semibold text-yellow-800">Loading product details...</p>
        </div>
      </div>
    );
  }

  const productTitle = product.productName || product.title || "Product";
  const productDescription =
    product.productDescription || product.description || "No description available.";
  const productPrice = product.productPrice || product.price || 0;
  const productStock = product.stock || 0;
  const images =
    product.images?.length > 0
      ? product.images
      : product.productImage
      ? [`${API_IMAGE_URL}uploads/${product.productImage}`]
      : [PLACEHOLDER_IMAGE];

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-bold text-yellow-800 flex items-center gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2903/2903401.png"
              alt="logo"
              className="w-8 h-8"
            />
            Makhana Mart
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="text-yellow-700 hover:text-yellow-900 font-medium"
            >
              ← Back to products
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-yellow-100 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6 text-yellow-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
              <div className="aspect-square mb-4 overflow-hidden rounded-xl shadow-md transition-transform duration-500 hover:scale-105">
                <img
                  src={selectedImage}
                  alt={productTitle}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="grid grid-cols-4 gap-3 mt-6">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-110 ${
                      selectedImage === image
                        ? "border-yellow-500 ring-2 ring-yellow-200"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:w-1/2 p-6 md:border-l md:border-yellow-100">
              <h1 className="text-3xl font-bold text-yellow-900 mb-4 animate-fadeIn">
                {productTitle}
              </h1>

              <div className="mb-6">
                <span className="text-2xl font-bold text-yellow-600">₹{productPrice}</span>
                <span className={`ml-3 text-sm font-medium bg-yellow-100 py-1 px-2 rounded-full ${
                  productStock > 0 ? "text-yellow-600" : "text-red-600 bg-red-100"
                }`}>
                  {productStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <p className="text-yellow-700 leading-relaxed mb-6">{productDescription}</p>

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-yellow-800 font-medium">Quantity:</span>
                <div className={`flex items-center border border-yellow-300 rounded-lg overflow-hidden ${
                  productStock === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                  <button
                    onClick={decreaseQuantity}
                    disabled={productStock === 0}
                    className="px-3 py-2 text-yellow-700 hover:bg-yellow-100 transition-colors disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-yellow-50 text-yellow-800">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={productStock === 0}
                    className="px-3 py-2 text-yellow-700 hover:bg-yellow-100 transition-colors disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={productStock > 0 ? handleAddToCart : undefined}
                disabled={productStock === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${
                  productStock > 0
                    ? isAddedToCart
                      ? "bg-yellow-700 text-white"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                {productStock > 0
                  ? (isAddedToCart ? "Added to Cart!" : "Add to Cart")
                  : "Out of Stock"
                }
              </button>

              <button className="w-full border border-yellow-300 text-yellow-700 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-50 transition-colors duration-300 flex items-center justify-center mt-3">
                Add to Wishlist
              </button>

              <div className="mt-8 pt-6 border-t border-yellow-100 space-y-3">
                <div className="flex items-center text-sm text-yellow-700">✅ High Protein & Low Fat</div>
                <div className="flex items-center text-sm text-yellow-700">✅ Gluten Free & Healthy Snack</div>
                <div className="flex items-center text-sm text-yellow-700">✅ Freshly Packaged</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;