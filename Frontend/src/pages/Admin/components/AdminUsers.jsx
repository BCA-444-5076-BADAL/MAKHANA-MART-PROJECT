export default function AdminUsers({
  users,
  totalUsers,
  totalOrders,
  totalRevenue,
  selectedUser,
  isEditingUser,
  userForm,
  orders,
  handleViewUser,
  handleEditUser,
  handleDeleteUser,
  handleUserFormChange,
  handleSaveUser,
  setIsEditingUser,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-3xl font-bold text-green-700">{totalUsers}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-blue-700">{totalOrders}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold text-red-700">₹{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.ordersCount}</td>
                  <td className="px-4 py-3">₹{user.totalSpent.toFixed(2)}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">User Details</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Phone:</strong> {selectedUser.phone}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Address:</strong> {selectedUser.address}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Orders:</strong> {selectedUser.ordersCount}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Total Spent:</strong> ₹{selectedUser.totalSpent.toFixed(2)}
            </p>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Purchase History</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                {orders
                  .filter((order) => order.userId === selectedUser.id)
                  .map((order) => (
                    <li key={order.id}>
                      {order.orderId}: {order.items.map((item) => item.title).join(", ")} ({order.status})
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {isEditingUser && userForm && (
          <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Edit User Profile</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  value={userForm.name}
                  onChange={handleUserFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  value={userForm.email}
                  onChange={handleUserFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  value={userForm.phone}
                  onChange={handleUserFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={userForm.address}
                  onChange={handleUserFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save User
                </button>
                <button
                  onClick={() => setIsEditingUser(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
