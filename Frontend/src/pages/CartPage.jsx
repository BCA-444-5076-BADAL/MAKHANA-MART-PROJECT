import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const API_IMAGE_URL = "http://localhost:5000/";



const CartPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems") || "[]");
  });



  console.log('Cart Items',cartItems)

  // Track removing item for animation
  const [removingItem, setRemovingItem] = useState(null);

  // Sync state to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item with animation
  const removeItem = (id) => {
    setRemovingItem(id);

    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setRemovingItem(null);
    }, 300);
  };

  // Checkout handler
  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const total = subtotal + tax + shipping;

//   return (

//     <div className="min-h-screen bg-green-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-green-800 animate-fadeIn">
//             Your Shopping Cart
//           </h1>
//           <span className="text-green-600 bg-green-100 py-1 px-3 rounded-full">
//             {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
//           </span>
//         </header>

//         {/* Cart Content */}
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Cart Items - Left side on desktop, top on mobile */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
//               {cartItems.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-green-300 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//                     />
//                   </svg>
//                   <h2 className="text-xl font-semibold text-green-700 mb-2">
//                     Your cart is empty
//                   </h2>
//                   <p className="text-green-500">
//                     Start shopping to add items to your cart
//                   </p>
//                 </div>
//               ) : (
//                 <ul className="divide-y divide-green-100">
//                   {cartItems.map((item) => (
//                     <li
//                       key={item.id}
//                       className={`p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 ${
//                         removingItem === item.id
//                           ? "opacity-0 transform translate-x-full"
//                           : "opacity-100 hover:bg-green-50"
//                       }`}
//                     >
//                       <img
//                         src={`${API_IMAGE_URL}uploads/${item.productImage
// }`}
//                         alt={item.title}
//                         className="w-20 h-20 object-cover rounded-lg shadow-md"
//                       />

//                       <div className="flex-1">
//                         <h3 className="text-lg font-semibold text-green-800">
//                           {item.productName}
//                         </h3>

//                           <p className="text-lg font-bold text-green-600 mt-1">
//                           {item.description
// }
//                         </p>
//                         <p className="text-lg font-bold text-green-600 mt-1">
//                           {item.productPrice}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         {/* Quantity Selector */}
//                         <div className="flex items-center border border-green-300 rounded-lg overflow-hidden">
//                           <button
//                             onClick={() =>
//                               updateQuantity(item.id, item.quantity - 1)
//                             }
//                             className="px-3 py-1 text-green-700 hover:bg-green-100 transition-colors duration-300"
//                           >
//                             -
//                           </button>
//                           <span className="px-4 py-1 bg-green-50 text-green-800 font-medium">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() =>
//                               updateQuantity(item.id, item.quantity + 1)
//                             }
//                             className="px-3 py-1 text-green-700 hover:bg-green-100 transition-colors duration-300"
//                           >
//                             +
//                           </button>
//                         </div>

//                         {/* Remove Button */}
//                         <button
//                           onClick={() => removeItem(item.id)}
//                           className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300 transform hover:scale-110"
//                           aria-label="Remove item"
//                         >
//                           <svg
//                             className="w-5 h-5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Continue Shopping Button */}
//             <a href="/">
//               <div className="mt-6">
//                 <button className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-300 transform hover:translate-x-1">
//                   <svg
//                     className="w-5 h-5 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                     />
//                   </svg>
//                   Continue Shopping
//                 </button>
//               </div>
//             </a>
//           </div>

//           {/* Cart Summary - Right side on desktop, bottom on mobile */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 transition-all duration-300 hover:shadow-xl">
//               <h2 className="text-xl font-semibold text-green-800 mb-6">
//                 Order Summary
//               </h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-green-600">Subtotal</span>
//                   <span className="font-medium text-green-700">
//                     ₹{subtotal.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-green-600">Estimated Tax</span>
//                   <span className="font-medium text-green-700">
//                     ₹{tax.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-green-600">Shipping</span>
//                   <span className="font-medium text-green-700">
//                     {shipping === 0 ? (
//                       <span className="text-green-500">Free</span>
//                     ) : (
//                       `₹${shipping.toFixed(2)}`
//                     )}
//                   </span>
//                 </div>

//                 <div className="flex justify-between pt-4 border-t border-green-200">
//                   <span className="text-lg font-semibold text-green-800">
//                     Total
//                   </span>
//                   <span className="text-lg font-bold text-green-600">
//                     ₹{total.toFixed(2)}
//                   </span>
//                 </div>

//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
//                   disabled={cartItems.length === 0}
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add custom CSS for animations */}
//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );

return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
    <div className="container mx-auto px-4">

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">
          🛒 Makhana Cart
        </h1>
        <span className="text-green-700 bg-green-200 py-1 px-4 rounded-full font-semibold shadow">
          {cartItems.length} Items
        </span>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT - CART ITEMS */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {cartItems.length === 0 ? (
              <div className="p-10 text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-2">
                  🛒 Your Cart is Empty
                </h2>
                <p className="text-gray-500">
                  Add some delicious makhana 😋
                </p>
              </div>
            ) : (
              <ul className="divide-y">

                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-green-50 transition"
                  >

                    {/* Image */}
                    <img
                      src={`${API_IMAGE_URL}uploads/${item.productImage}`}
                      className="w-24 h-24 object-cover rounded-xl shadow"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-800">
                        {item.productName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>

                      <p className="text-green-600 font-semibold mt-1">
                        ₹{item.productPrice}
                      </p>

                      {/* Subtotal per item */}
                      <p className="text-sm text-gray-600 mt-1">
                        Total: ₹{(item.productPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-3">

                      {/* Quantity */}
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Continue Shopping */}
          <a href="/">
            <button className="mt-6 text-green-700 font-medium hover:underline">
              ← Continue Shopping
            </button>
          </a>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">

            <h2 className="text-xl font-bold text-green-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-700">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
              >
                🚀 Checkout
              </button>

              {/* Extra Trust Badge */}
              <p className="text-xs text-center text-gray-500 mt-2">
                🔒 Secure Checkout | Cash on Delivery Available
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
};

export default CartPage;