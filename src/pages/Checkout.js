import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Checkout = () => {
  const [items, setItems] = useState([]); 
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;

    setUser(storedUser);

    if (buyNowItem) {
      setItems([buyNowItem]);
    } else {
    
      setItems(storedCart);
    }
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const grandTotal = subtotal + shipping;

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to continue checkout.");
      navigate("/login");
      return;
    }
    if (!user) {
      alert("Please login to place order.");
      return navigate("/login");
    }
    if (!address.trim()) {
      alert("Please enter your address");
      return;
    }

    try {
      const orderData = {
        user: user._id,
        orderItems: items.map((item) => ({
          book: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: grandTotal,
        shippingAddress: address,
        paymentMethod: "COD",
      };

      await api.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");

      
      localStorage.removeItem("buyNowItem");

      if (items.length > 1 || !localStorage.getItem("buyNowItem")) {
        localStorage.removeItem("cart");
      }

      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  if (items.length === 0) {
    return (
      <h3 className="text-center mt-5 text-muted">
        Your cart is empty. Add products before checkout.
      </h3>
    );
  }

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar Search={false} Cart={false} />
      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">Checkout</h2>

        <div className="row gy-4">
          <div className="col-md-7">
            <div className="card p-4 shadow-sm">
              <h4 className="fw-bold mb-3">Billing Details</h4>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.name || ""}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Shipping Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter full address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card p-4 shadow-sm">
              <h4 className="fw-bold mb-3">Order Summary</h4>

              {items.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between mb-3"
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p className="text-muted mb-0">Qty: {item.quantity}</p>
                  </div>
                  <div className="fw-bold">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>₹{subtotal}</strong>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between fs-5">
                <span>Grand Total</span>
                <strong>₹{grandTotal}</strong>
              </div>

              <button
                className="btn btn-success w-100 mt-4"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
