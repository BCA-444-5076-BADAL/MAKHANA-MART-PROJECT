import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRImage from "../assets/QR.jpeg";

const API_URL = "http://localhost:5000"; // backend URL

const CheckoutPage = () => {
  // Function to save order to backend
  const saveOrder = async (userId, products, amount) => {
    try {
      const orderPayload = {
        userId,
        products,
        amount,
        paymentId: null,
      };
      console.log('Saving order with payload:', orderPayload);
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });
      const responseData = await res.json();
      console.log('Save order response:', responseData);
      if (!res.ok) throw new Error("Failed to save order: " + (responseData.error || res.statusText));
      return responseData;
    } catch (err) {
      console.error("Error saving order:", err);
      toast.error("Failed to place order: " + err.message);
      return null;
    }
  };

  // Razorpay payment handler
  const loadRazorpay = async (orderAmount, products) => {
    const options = {
      key: "rzp_test_RNuaxoLNDY8oTc", // Provided Razorpay Key ID
      amount: Math.round(orderAmount * 100), // in paise
      currency: "INR",
      name: "Makhana Mart",
      description: "Order Payment",
      handler: async function (response) {
        toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id, {
          position: "top-right",
          autoClose: 3000,
        });
        setCartItems([]);
        localStorage.removeItem("cartItems");
        setTimeout(() => navigate("/"), 2000);
      },
      prefill: {
        name: userData.name,
        email: userData.email,
      },
      theme: {
        color: "#2563eb",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItems") || "[]");
  });
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zip: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrOrderData, setQrOrderData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Totals (fix NaN by validating price/quantity)
  // Debug: log cartItems to console
  console.log('cartItems:', cartItems);

  // Use productPrice for calculations (matches CartPage)
  const subtotal = cartItems.reduce((sum, item) => {
    let price = item.productPrice;
    let quantity = item.quantity;
    price = typeof price === 'string' ? parseFloat(price) : price;
    quantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    price = typeof price === 'number' && !isNaN(price) ? price : 0;
    quantity = typeof quantity === 'number' && !isNaN(quantity) ? quantity : 0;
    return sum + price * quantity;
  }, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = userData.name.trim();
    const trimmedAddress = userData.address.trim();
    const trimmedLandmark = userData.landmark.trim();
    const trimmedZip = userData.zip.trim();
    const trimmedPhone = userData.phone.trim();

    if (!/^[A-Za-z ]{2,}$/.test(trimmedName)) {
      alert("Enter a valid name.");
      return;
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    if (trimmedAddress.length < 5) {
      alert("Enter a valid street address.");
      return;
    }

    if (!/^\d{6}$/.test(trimmedZip)) {
      alert("Pin code must be exactly 6 digits.");
      return;
    }

    if (trimmedLandmark.length < 3) {
      alert("Enter a valid landmark.");
      return;
    }

    setIsProcessing(true);

    // Convert cart items to products format expected by backend
    const products = cartItems.map(item => {
      const productId = item.id || item.productId || item.productid;
      console.log('Cart item:', item, 'Extracted productId:', productId);
      return {
        productId: productId,
        quantity: item.quantity,
      };
    });

    console.log('Sending order data:', { userId: "user1", products, amount: total });

    setTimeout(() => {
      setIsProcessing(false);
      if (paymentMethod === "cod") {
        // Save order to backend
        saveOrder("user1", products, total);
        toast.success("🎉 Order placed successfully with Cash on Delivery!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          setCartItems([]);
          localStorage.removeItem("cartItems");
          navigate("/");
        }, 2000);
      } else if (paymentMethod === "online") {
        // Save order to backend
        saveOrder("user1", products, total);
        toast.info("Redirecting to online payment gateway...", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          loadRazorpay(total, products);
        }, 2000);
      } else if (paymentMethod === "qr") {
        // Show QR code for UPI payment
        setQrOrderData({ userId: "user1", products, amount: total });
        setShowQRModal(true);
      }
    }, 1000);
  };

  // Handle QR payment confirmation
  const handleQRPaymentConfirm = async () => {
    if (qrOrderData) {
      await saveOrder(qrOrderData.userId, qrOrderData.products, qrOrderData.amount);
      toast.success("🎉 Payment received! Order placed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        setCartItems([]);
        localStorage.removeItem("cartItems");
        setShowQRModal(false);
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800">Checkout</h1>
          <p className="text-blue-600 mt-2">
            Enter your details and complete the order
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg"
                  required
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number (10 digits)"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={userData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  value={userData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg"
                  required
                />

                <input
                  type="text"
                  name="zip"
                  placeholder="Pin Code (6 digits)"
                  value={userData.zip}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg"
                  required
                />

                {/* Payment */}
                <h2 className="text-xl font-semibold text-blue-800 mt-6">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span>Cash on Delivery</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                    />
                    <span>Online Payment (Razorpay)</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="qr"
                      checked={paymentMethod === "qr"}
                      onChange={() => setPaymentMethod("qr")}
                    />
                    <span>UPI QR Code Payment</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-3 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 mt-6"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Order Summary
              </h2>

              {/* Cart items list */}
              <div className="space-y-3 mb-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="text-gray-800 font-medium">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity ?? 0} × ₹{typeof item.productPrice === 'number' ? item.productPrice.toFixed(2) : (typeof item.productPrice === 'string' ? parseFloat(item.productPrice).toFixed(2) : '0.00')}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₹{(typeof item.productPrice === 'number' && typeof item.quantity === 'number' ? (item.quantity * item.productPrice).toFixed(2) : (typeof item.productPrice === 'string' && typeof item.quantity === 'number' ? (item.quantity * parseFloat(item.productPrice)).toFixed(2) : '0.00'))}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items in cart</p>
                )}
              </div>

              {/* Subtotal, tax, shipping, total */}
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-blue-800 text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
              Scan to Pay
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6 flex justify-center">
              <img 
                src={QRImage} 
                alt="UPI QR Code" 
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Amount:</strong> ₹{total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Merchant:</strong> Makhana Mart
              </p>
            </div>

            <p className="text-center text-gray-600 text-sm mb-6">
              Scan this QR code with any UPI app to complete your payment.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleQRPaymentConfirm}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
              >
                ✓ Payment Completed
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;