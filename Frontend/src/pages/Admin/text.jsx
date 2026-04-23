import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium flex items-center space-x-2 ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <i
        className={
          type === "success"
            ? "fas fa-check-circle"
            : "fas fa-exclamation-circle"
        }
      ></i>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  );
};

// Sidebar Component
const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: "fas fa-tachometer-alt", label: "Dashboard" },
    { path: "/products", icon: "fas fa-shopping-bag", label: "All Products" },
    {
      path: "/add-product",
      icon: "fas fa-plus-circle",
      label: "Add New Product",
    },
    { path: "/orders", icon: "fas fa-clipboard-list", label: "Orders" },
    { path: "/settings", icon: "fas fa-cog", label: "Settings" },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-xl font-bold text-green-400">Admin Dashboard</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-green-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <i className={`${item.icon} w-5 mr-3`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Dashboard Page
const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
              <i className="fas fa-shopping-bag text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">142</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-clipboard-list text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">256</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
              <i className="fas fa-users text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
              <i className="fas fa-dollar-sign text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">$24,895</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3">#ORD-7582</td>
                <td className="py-3">John Smith</td>
                <td className="py-3">Nov 12, 2023</td>
                <td className="py-3">$245.99</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Delivered
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3">#ORD-7581</td>
                <td className="py-3">Emma Johnson</td>
                <td className="py-3">Nov 11, 2023</td>
                <td className="py-3">$145.99</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Processing
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3">#ORD-7580</td>
                <td className="py-3">Michael Brown</td>
                <td className="py-3">Nov 10, 2023</td>
                <td className="py-3">$89.99</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Shipped
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    price: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        image: product.image || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {product ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Beauty">Beauty</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            {product ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

// All Products Page
const AllProducts = ({ products, onEdit, onDelete }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
        <Link
          to="/add-product"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <i className="fas fa-plus-circle mr-2"></i>
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.title}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add Product Page
const AddProduct = ({ onAddProduct }) => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (formData) => {
    onAddProduct(formData);
    setShowToast(true);
  };

  const handleCancel = () => {
    // Navigate back to products page
    window.history.back();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-600">
          Fill in the details below to add a new product
        </p>
      </div>

      <div className="max-w-2xl">
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {showToast && (
        <Toast
          message="Product added successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

// Orders Page
const Orders = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Orders Management
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <i className="fas fa-plus-circle mr-2"></i>
              New Order
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">#ORD-7582</td>
                <td className="py-3">John Smith</td>
                <td className="py-3">Nov 12, 2023</td>
                <td className="py-3">$245.99</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Delivered
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">#ORD-7581</td>
                <td className="py-3">Emma Johnson</td>
                <td className="py-3">Nov 11, 2023</td>
                <td className="py-3">$145.99</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Processing
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">#ORD-7580</td>
                <td className="py-3">Michael Brown</td>
                <td className="py-3">Nov 10, 2023</td>
                <td className="py-3">$89.99</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Shipped
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Settings Page
const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Store Information
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  defaultValue="My E-commerce Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Description
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  defaultValue="The best place to shop for quality products"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  defaultValue="contact@myecommercestore.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Theme Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-600"></div>
                  <span className="text-sm text-gray-600">Green (Current)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dark Mode
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm text-gray-600">
                    Enable Dark Mode
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              System Info
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-medium">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="font-medium">Nov 10, 2023</span>
              </div>
              <div className="flex justify-between">
                <span>Server Status</span>
                <span className="font-medium text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const EcommerceAdminDashboard = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      price: 89.99,
      description: "High-quality wireless headphones with noise cancellation",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Running Shoes",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      price: 129.99,
      description: "Comfortable running shoes for all terrains",
      category: "Footwear",
    },
    {
      id: 3,
      title: "Smart Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      price: 199.99,
      description: "Feature-rich smartwatch with health monitoring",
      category: "Electronics",
    },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
    };
    setProducts([...products, newProduct]);
    setToastMessage("Product added successfully!");
    setToastType("success");
    setShowToast(true);
  };

  const handleEditProduct = (productData) => {
    const updatedProducts = products.map((product) =>
      product.id === editingProduct.id
        ? { ...productData, id: editingProduct.id }
        : product
    );
    setProducts(updatedProducts);
    setEditingProduct(null);
    setToastMessage("Product updated successfully!");
    setToastType("success");
    setShowToast(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setToastMessage("Product deleted successfully!");
      setToastType("success");
      setShowToast(true);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Admin Panel
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <i className="fas fa-bell text-gray-600"></i>
                </button>
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="User profile"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Admin User
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/products"
                element={
                  <AllProducts
                    products={products}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteProduct}
                  />
                }
              />
              <Route
                path="/add-product"
                element={<AddProduct onAddProduct={handleAddProduct} />}
              />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full">
              <ProductForm
                product={editingProduct}
                onSubmit={handleEditProduct}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </Router>
  );
};

export default EcommerceAdminDashboard;