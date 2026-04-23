export default function AdminEditProduct({
  editProduct,
  editFile,
  setEditFile,
  handleSaveEdit,
  setActivePage,
  setEditProduct,
}) {
  const fields = [
    { name: "productName", label: "Product Name", type: "text" },
    { name: "productPrice", label: "Product Price", type: "number" },
    { name: "description", label: "Description", type: "text" },
    { name: "category", label: "Category", type: "text" },
    { name: "stock", label: "Stock", type: "number" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form
        onSubmit={handleSaveEdit}
        className="space-y-4 max-w-lg bg-white p-6 rounded-lg shadow-lg"
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              value={editProduct[field.name] || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  [field.name]:
                    field.type === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Update Product Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditFile(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="space-x-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setActivePage("all");
              setEditProduct(null);
              setEditFile(null);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
