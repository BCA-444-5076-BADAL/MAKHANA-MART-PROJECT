export default function AdminOrders({
  orders,
  totalUsers,
  totalOrders,
  totalRevenue,
  selectedOrder,
  handleViewOrder,
  handleDeleteOrder,
  handleUpdateOrderStatus,
}) {
  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-green-700">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-blue-700">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-red-700">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{order.orderId}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{order.address}</td>
                    <td className="px-4 py-3">₹{order.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Order Details</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Order ID:</strong> {selectedOrder.orderId}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Address:</strong> {selectedOrder.address}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Payment:</strong> {selectedOrder.paymentMethod}
              </p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.title} × {item.qty}
                    </span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
