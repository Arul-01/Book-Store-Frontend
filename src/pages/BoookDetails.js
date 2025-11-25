import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaStar } from "react-icons/fa";
import "../styles/loader.css";
import Navbar from "../components/Navbar";
import { Toast, ToastContainer } from "react-bootstrap"; // Import Toast

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews] = useState(7);

  // --- Toast State ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (!Array.isArray(cart)) {
      cart = [];
    }

    const existingBook = cart.find((item) => item._id === book._id);

    if (existingBook) {
      existingBook.quantity += quantity;
    } else {
      cart.push({ ...book, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    // --- Show Toast ---
    setToastMessage(`${book.title} added to cart (Qty: ${quantity})`);
    setShowToast(true);
  };

  const handleBuyNow = () => {
    const buyNowItem = { ...book, quantity };
    localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="loader text-primary"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) return <h5 className="text-center mt-5">Book not found!</h5>;

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      
      {/* --- Toast Container --- */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, position: 'fixed' }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Success</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="container my-5">
        <div className="row gy-5">
          <div className="col-md-5 d-flex justify-content-center">
            <img
              src={book.images && book.images[0]}
              alt={book.title}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "450px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-7">
            <h2 className="fw-bold">{book.title}</h2>
            <p className="text-muted mb-1">by {book.author}</p>

            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    color={i < Math.round(book.rating) ? "#ffc107" : "#e4e5e9"}
                  />
                ))}
              </div>
              <span className="fw-semibold">{book.rating}</span>
              <span className="text-muted ms-2">({reviews} Reviews)</span>
            </div>

            <p className="text-secondary" style={{ lineHeight: "1.6" }}>
              {book.description || "No description available for this book at the moment."}
            </p>

            <hr />

            <div className="mb-3">
              <h4 className="text-success fw-bold">₹{book.price}</h4>
              <span className="badge bg-success">In Stock</span>
            </div>

            <div className="d-flex align-items-center mb-4">
              <span className="fw-semibold me-3">Quantity:</span>
              <div className="input-group" style={{ width: "130px" }}>
                <button className="btn btn-outline-secondary" onClick={decreaseQty}>-</button>
                <input type="text" className="form-control text-center" value={quantity} readOnly />
                <button className="btn btn-outline-secondary" onClick={increaseQty}>+</button>
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex">
              <button className="btn btn-warning text-white fw-semibold w-100 w-md-auto" onClick={handleBuyNow}>Buy Now</button>
              <button className="btn btn-outline-primary fw-semibold w-100 w-md-auto" onClick={handleAddToCart}>Add to Cart</button>
            </div>

            <hr className="my-4" />

            <div>
              <p className="mb-1">🚚 <strong>Free Shipping</strong> on orders above ₹500</p>
              <p className="mb-0">🔄 <strong>7 Days Easy Return</strong> policy available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;