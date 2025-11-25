import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subTotal > 0 ? 50 : 0; 
  const grandTotal = subTotal + shipping;

  const handleQuantityChange = (id, type) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id) {
        const newQty = type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };


  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      // --- Show Modal instead of Alert ---
      setShowModal(true);
      return;
    }
    navigate("/checkout");
  };

  return (
    <div>
    <Navbar/>
    
    {/* --- Warning Modal --- */}
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Cart is Empty</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Please add some books to your cart before proceeding to checkout.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => { setShowModal(false); navigate("/"); }}>
          Go to Home
        </Button>
      </Modal.Footer>
    </Modal>

    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5" style={{ color: "#333" }}>
        Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-center text-muted fs-5">Your cart is empty.</p>
      ) : (
        <>
    
          <div className="table-responsive mb-5">
            <table className="table align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td className="text-start d-flex align-items-center gap-3">
                      <img
                        src={item.images && item.images[0]}
                        alt={item.title}
                        style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                      />
                      <div>
                        <h6 className="mb-1">{item.title}</h6>
                        <small className="text-muted">by {item.author}</small>
                      </div>
                    </td>
                    <td>₹{item.price}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center">
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item._id, "dec")}>-</button>
                        <span className="mx-3 fw-semibold">{item.quantity}</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item._id, "inc")}>+</button>
                      </div>
                    </td>
                    <td className="fw-bold text-success">₹{item.price * item.quantity}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item._id)}>X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-end">
            <div className="col-md-5 col-lg-4">
              <div className="card shadow-sm border-0 p-4">
                <h5 className="fw-bold mb-3">Cart Total</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Sub Total</span>
                  <span>₹{subTotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-4">
                  <span>Grand Total</span>
                  <span className="text-success">₹{grandTotal}</span>
                </div>

                <button className="btn btn-dark w-100 fw-semibold" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default Cart;