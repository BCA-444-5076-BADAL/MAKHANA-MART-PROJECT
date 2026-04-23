export default function AdminAddProduct({ newProduct, setNewProduct, file, setFile, handleAddProduct }) {
  const fields = [
    { name: "productName", label: "Product Name", type: "text" },
    { name: "productPrice", label: "Product Price", type: "number" },
    { name: "description", label: "Description", type: "text" },
    { name: "category", label: "Category", type: "text" },
    { name: "stock", label: "Stock", type: "number" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form
        onSubmit={handleAddProduct}
        className="space-y-4 max-w-lg bg-white p-6 rounded-lg shadow-lg"
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              value={newProduct[field.name]}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  [field.name]:
                    field.type === "number"
                      ? e.target.value
                      : e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
