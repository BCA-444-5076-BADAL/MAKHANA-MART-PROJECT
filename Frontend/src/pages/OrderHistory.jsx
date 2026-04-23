import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});

  const fetchOrderHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${userId}`);
      const data = await res.json();
      const orders = Array.isArray(data) ? data : data.orders || [];
      setOrders(orders);

      // Extract product IDs
      const ids = [];
      orders.forEach(o => o.products.forEach(p => ids.push(p.productId)));

      fetchProductDetails(ids);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (ids) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/products`);
      const data = await res.json();

      const map = {};
      data.products.forEach(p => {
        if (ids.includes(p.id)) {
          map[p.id] = p;
        }
      });

      setProducts(map);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [userId]);

  const getStatusColor = (status) => {
    if (!status) return "bg-yellow-100 text-yellow-700";
    if (status === "delivered") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-600";
    return "bg-blue-100 text-blue-700";
  };

  if (loading)
    return (
      <div className="text-center py-10 text-green-700 font-semibold">
        Loading your orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          No Orders Yet 😔
        </h2>
        <p className="text-gray-500">Start shopping from Makhana Mart</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          🧾 Your Orders
        </h2>

        {orders.map((order) => (
          <div
            key={order.orderId}
            className="mb-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            {/* Top Info */}
            <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4 gap-4">

              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800">
                  #{order.orderId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-green-700">
                  ₹{order.amount}
                </p>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              {order.products.map((item, idx) => {
                const product = products[item.productId];

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg hover:bg-green-50 transition"
                  >

                    {/* Image */}
                    <img
                      src={
                        product?.productImage
                          ? `${API_URL}/uploads/${product.productImage}`
                          : "https://via.placeholder.com/80"
                      }
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {product?.productName || "Product"}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="font-semibold text-green-700">
                      ₹{product?.productPrice || "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex justify-between items-center">

              <button className="text-green-600 hover:underline text-sm">
                View Details
              </button>

              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">
                Reorder 🔄
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderHistory;