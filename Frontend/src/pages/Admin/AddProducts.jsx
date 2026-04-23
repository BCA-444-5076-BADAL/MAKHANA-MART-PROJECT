import React, { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminProducts from "./components/AdminProducts";
import AdminAddProduct from "./components/AdminAddProduct";
import AdminOrders from "./components/AdminOrders";
import AdminUsers from "./components/AdminUsers";
import AdminEditProduct from "./components/AdminEditProduct";

const API_URL = "http://localhost:5000/api/admin/products";
const API_IMAGE_URL = "http://localhost:5000/";
const ORDERS_API_URL = "http://localhost:5000/api/admin/orders";
const USERS_API_URL = "http://localhost:5000/api/admin/users";

const initialUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "987654321012",
    address: "123 MG Road, Delhi, 110001",
    ordersCount: 2,
    totalSpent: 1499.98,
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "912345678901",
    address: "45 Park Street, Kolkata, 700016",
    ordersCount: 1,
    totalSpent: 699.99,
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit.verma@example.com",
    phone: "998877665544",
    address: "8 Nehru Nagar, Jaipur, 302015",
    ordersCount: 1,
    totalSpent: 349.99,
  },
];

const initialOrders = [
  {
    id: 1,
    orderId: "#ORD-1001",
    userId: 1,
    customer: "Rahul Sharma",
    address: "123 MG Road, Delhi, 110001",
    date: "Apr 8, 2026",
    amount: 799.99,
    status: "Processing",
    paymentMethod: "UPI QR",
    items: [
      { title: "Masala Makhana", qty: 1, price: 349.99 },
      { title: "Roasted Almonds", qty: 1, price: 449.99 },
    ],
  },
  {
    id: 2,
    orderId: "#ORD-1002",
    userId: 2,
    customer: "Priya Singh",
    address: "45 Park Street, Kolkata, 700016",
    date: "Apr 7, 2026",
    amount: 699.99,
    status: "Shipped",
    paymentMethod: "Online Payment",
    items: [{ title: "Organic Spices Box", qty: 1, price: 699.99 }],
  },
  {
    id: 3,
    orderId: "#ORD-1003",
    userId: 3,
    customer: "Amit Verma",
    address: "8 Nehru Nagar, Jaipur, 302015",
    date: "Apr 6, 2026",
    amount: 349.99,
    status: "Delivered",
    paymentMethod: "Cash on Delivery",
    items: [{ title: "Healthy Snack Pack", qty: 1, price: 349.99 }],
  },
];

const normalizeOrder = (order) => {
  const products = Array.isArray(order.products) ? order.products : [];
  const itemsFromProducts = products.map((product) => ({
    title: product.productName || product.title || "Product",
    qty: product.quantity ?? product.qty ?? 1,
    price: Number(product.productPrice ?? product.price ?? 0),
  }));

  const addressFromParts = [order.address, order.city, order.pincode]
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== "")
    .join(", ");

  return {
    ...order,
    id: order.id || order._id || order.orderId || order.order_id || null,
    orderId: order.orderId || order.order_id || order._id || "",
    userId:
      order.userId || order.user_id || order.user?._id || order.user?.id || order.user || null,
    customer:
      order.customer || order.user?.name || order.userName || order.user?.fullName || "Unknown",
    address:
      order.address || order.shippingAddress || order.addressLine || order.user?.address || addressFromParts || "",
    date: order.date || order.createdAt || order.orderDate || order.created_at || "",
    amount: Number(order.amount ?? order.total ?? 0),
    status: order.status || order.orderStatus || "Pending",
    paymentMethod:
      order.paymentMethod || order.payment || order.paymentId || order.payment_id || "Unknown",
    items: Array.isArray(order.items) ? order.items : itemsFromProducts,
  };
};

const normalizeUser = (user) => {
  const addressFromParts = [user.address, user.city, user.pincode]
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== "")
    .join(", ");

  return {
    ...user,
    id: user.id || user._id || user.userId || null,
    name: user.name || user.fullName || "Unknown",
    email: user.email || user.userEmail || "",
    phone: user.phone || user.mobile || "",
    address: user.address || addressFromParts || user.addressLine || user.location || "",
    totalSpent: Number(user.totalSpent ?? user.spent ?? user.total ?? 0),
    ordersCount: Number(
      user.ordersCount ?? user.orderCount ?? user.order_id ?? (user.orders ? user.orders.length : 0) ?? 0
    ),
  };
};

export default function EcommerceAdminDashboard() {
  const [file, setFile] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [activePage, setActivePage] = useState("all");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productPrice: "",
    description: "",
    category: "",
    stock: "",
  });
  const [editProduct, setEditProduct] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [users, setUsers] = useState(initialUsers);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

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

  const getPayloadArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.rows)) return data.rows;
    if (Array.isArray(data.data)) return data.data;
    if (data && typeof data === "object") return [data];
    return [];
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(ORDERS_API_URL);
      const data = await res.json();
      const ordersPayload = getPayloadArray(data);
      console.log("Admin orders payload:", ordersPayload.length, ordersPayload);
      setOrders(ordersPayload.map(normalizeOrder));
    } catch (err) {
      console.warn("Orders fetch failed, using local sample orders.", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_API_URL);
      const data = await res.json();
      const usersPayload = getPayloadArray(data);
      console.log("Admin users payload:", usersPayload.length, usersPayload);
      setUsers(usersPayload.map(normalizeUser));
    } catch (err) {
      console.warn("Users fetch failed, using local sample users.", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const usersWithStats = users.map((user) => {
    const userOrders = orders.filter((order) => order.userId === user.id);
    const ordersCount = Number(
      user.ordersCount ?? user.orderCount ?? userOrders.length ?? 0
    );
    const totalSpent = Number(
      user.totalSpent ?? user.spent ?? userOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0)
    );

    return {
      ...user,
      ordersCount,
      totalSpent,
    };
  });

  const selectedUserWithStats = selectedUser
    ? {
        ...selectedUser,
        ordersCount:
          selectedUser.ordersCount ??
          orders.filter((order) => order.userId === selectedUser.id).length,
        totalSpent:
          selectedUser.totalSpent ??
          orders
            .filter((order) => order.userId === selectedUser.id)
            .reduce((sum, order) => sum + Number(order.amount || 0), 0),
      }
    : null;

  const totalUsers = usersWithStats.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.productName || !newProduct.productPrice || !newProduct.category || !newProduct.stock) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    if (/^\d+$/.test(newProduct.productName.trim())) {
      alert("⚠️ Product name cannot be only numbers");
      return;
    }

    const price = parseFloat(newProduct.productPrice);
    if (isNaN(price) || price <= 0) {
      alert("⚠️ Price must be a positive number");
      return;
    }

    const stock = parseInt(newProduct.stock, 10);
    if (isNaN(stock) || stock < 0) {
      alert("⚠️ Stock must be a non-negative number");
      return;
    }

    if (!file) {
      alert("⚠️ Please upload product image");
      return;
    }

    const formData = new FormData();
    formData.append("productName", newProduct.productName);
    formData.append("productPrice", price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    formData.append("stock", stock);
    formData.append("productImage", file);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`❌ ${data.error || "Something went wrong"}`);
        return;
      }
      setProducts((prev) => [...prev, data.product]);
      setNewProduct({
        productName: "",
        productPrice: "",
        description: "",
        category: "",
        stock: "",
      });
      setFile(null);
      alert("✅ Product added successfully!");
      setActivePage("all");
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setActivePage("edit");
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserForm(user);
    setIsEditingUser(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({ ...user });
    setIsEditingUser(true);
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    if (!userForm) return;

    try {
      const res = await fetch(`${USERS_API_URL}/${userForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to update user");
      }
      setUsers((prev) => prev.map((u) => (u.id === userForm.id ? data.user || data : u)));
      setSelectedUser((prev) => (prev?.id === userForm.id ? { ...prev, ...userForm } : prev));
      setIsEditingUser(false);
      alert("✅ User updated successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${USERS_API_URL}/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unable to delete user");
      }
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setUserForm(null);
        setIsEditingUser(false);
      }
      alert("✅ User deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete user");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );

    try {
      const res = await fetch(`${ORDERS_API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to update order status");
      }
      const updatedOrder = normalizeOrder(data.order || data);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      alert("✅ Order status updated");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${ORDERS_API_URL}/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unable to delete order");
      }
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      alert("✅ Order deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete order");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      let data;
      if (editFile) {
        const formData = new FormData();
        formData.append("productName", editProduct.productName);
        formData.append("productPrice", editProduct.productPrice);
        formData.append("description", editProduct.description);
        formData.append("category", editProduct.category);
        formData.append("stock", editProduct.stock);
        formData.append("productImage", editFile);

        const res = await fetch(`${API_URL}/${editProduct.id}`, {
          method: "PUT",
          body: formData,
        });
        data = await res.json();
      } else {
        const res = await fetch(`${API_URL}/${editProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProduct),
        });
        data = await res.json();
      }

      setProducts(products.map((p) => (p.id === data.id ? data : p)));
      setEditProduct(null);
      setEditFile(null);
      setActivePage("all");
      alert("✅ Product updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error updating product");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-6 overflow-y-auto">
        {activePage === "all" && (
          <AdminProducts products={products} handleEdit={handleEdit} handleDelete={handleDelete} />
        )}
        {activePage === "add" && (
          <AdminAddProduct
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            file={file}
            setFile={setFile}
            handleAddProduct={handleAddProduct}
          />
        )}
        {activePage === "orders" && (
          <AdminOrders
            orders={orders}
            totalUsers={totalUsers}
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            selectedOrder={selectedOrder}
            handleViewOrder={handleViewOrder}
            handleDeleteOrder={handleDeleteOrder}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
        {activePage === "users" && (
          <AdminUsers
            users={usersWithStats}
            totalUsers={totalUsers}
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            selectedUser={selectedUserWithStats}
            isEditingUser={isEditingUser}
            userForm={userForm}
            orders={orders}
            handleViewUser={handleViewUser}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            handleUserFormChange={handleUserFormChange}
            handleSaveUser={handleSaveUser}
            setIsEditingUser={setIsEditingUser}
          />
        )}
        {activePage === "edit" && editProduct && (
          <AdminEditProduct
            editProduct={editProduct}
            editFile={editFile}
            setEditFile={setEditFile}
            handleSaveEdit={handleSaveEdit}
            setActivePage={setActivePage}
            setEditProduct={setEditProduct}
          />
        )}
      </div>
    </div>
  );
}
