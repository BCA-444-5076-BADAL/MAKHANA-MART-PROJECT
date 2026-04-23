import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/admin/products";
const API_IMAGE_URL = "http://localhost:5000/";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-600 mt-2">Browse all available products and click any item to view details.</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-3 text-white font-semibold hover:bg-green-700 transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 shadow-md text-center text-gray-700">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 shadow-md text-center text-gray-700">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`${API_IMAGE_URL}uploads/${product.productImage}`}
                    alt={product.productName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{product.productName}</h2>
                    <p className="text-green-600 font-bold text-lg mt-2">₹{product.productPrice}</p>
                    <p className={`text-sm font-medium mt-1 ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/products/${product.id}`}
                      state={{ product }}
                      className="w-full inline-flex items-center justify-center rounded-full bg-yellow-500 px-4 py-3 text-white font-semibold hover:bg-yellow-600 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
