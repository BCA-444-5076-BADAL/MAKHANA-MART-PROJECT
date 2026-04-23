import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-yellow-700 text-white shadow">
      <div className="text-2xl font-bold">
        <Link to="/"></Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/cart" className="hover:text-blue-200">🛒 Cart</Link>
        <Link to="/order-history" className="hover:text-blue-200">My Orders</Link>
      </div>
    </nav>
  );
}
