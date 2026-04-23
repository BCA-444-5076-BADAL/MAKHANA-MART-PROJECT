export default function AdminSidebar({ activePage, setActivePage }) {
  const navItems = [
    { id: "all", label: "All Products" },
    { id: "add", label: "Add New Product" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
  ];

  return (
    <div className="w-64 bg-green-700 text-white p-6 flex flex-col space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`text-left px-4 py-2 rounded ${
            activePage === item.id ? "bg-green-900" : "hover:bg-green-800"
          }`}
          onClick={() => setActivePage(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
