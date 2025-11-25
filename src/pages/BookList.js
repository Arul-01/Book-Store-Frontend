import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/BookList.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap"; // Import Toast

const BookList = ({ searchText }) => {
  const [books, setBooks] = useState([]);
  
  // --- Toast State ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  const navigate = useNavigate();

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingBook = cart.find((item) => item._id === book._id);

    if (existingBook) {
      existingBook.quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Notify Navbar
    window.dispatchEvent(new Event("cartUpdated"));

    // --- Show Toast instead of Alert ---
    setToastMessage(`${book.title} added to cart!`);
    setShowToast(true);
  };

  const handleBuyNow = (book) => {
    const selected = {
      ...book,
      quantity: 1,
    };

    localStorage.setItem("buyNowItem", JSON.stringify(selected));
    navigate("/checkout");
  };

  const filteredBooks = books.filter((book) => {
    if (!searchText) return true;
    const text = searchText.toLowerCase();
    return (
      book.title.toLowerCase().includes(text) ||
      book.author.toLowerCase().includes(text) ||
      book.category?.toLowerCase().includes(text) ||
      book.description?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="container my-5 position-relative">
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

      <h2 className="text-center mb-5 fw-bold" style={{ color: "rgb(191, 162, 96)" }}>
        Top Selling Books
      </h2>

      <div className="row g-5 justify-content-center">
        {filteredBooks.length === 0 && (
          <h4 className="text-center text-muted mt-4">No books found 😥</h4>
        )}

        {filteredBooks.map((book) => (
          <div key={book._id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
            <div className="card shadow-sm border-0 h-100 w-100" style={{ maxWidth: "270px" }}>
              <Link to={`/book/${book._id}`} className="text-decoration-none text-dark">
                <div className="rounded-top" style={{ width: "100%", paddingTop: "140%", position: "relative", overflow: "hidden" }}>
                  <img src={book.images && book.images[0]} alt={book.title} className="w-100 h-100" style={{ position: "absolute", top: "0", left: "0", objectFit: "cover" }} />
                </div>
              </Link>

              <div className="card-body text-center d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title text-truncate fw-semibold">{book.title}</h5>
                  <p className="card-text text-muted mb-1">by {book.author}</p>
                </div>

                <div className="text-center pb-3">
                  <p className="fw-bold text-success fs-5 mb-3">₹{book.price}</p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button className="btn btn-danger btn-sm w-100 w-md-auto mx-md-2 mb-2 mb-md-0" onClick={() => handleBuyNow(book)}>Buy Now</button>
                    <button className="btn btn-primary btn-sm w-100 w-md-auto" onClick={() => handleAddToCart(book)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;