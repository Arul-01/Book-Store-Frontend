import React, { useState } from "react";
import api from "../../../api/axios";
import AdminNavbar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer, Modal, Button } from "react-bootstrap";

function AddBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Toast + Modal state
  const [showToast, setShowToast] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("genre", form.genre);
    formData.append("price", form.price);
    formData.append("description", form.description);

    if (image) {
      formData.append("images", image);
    }

    try {
      await api.post("/books/add-book", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setShowToast(true);   // show success
      setTimeout(() => navigate("/admin/books"), 1500);

    } catch (err) {
      console.error(err.response?.data);
      setShowErrorModal(true); // show error modal
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />

      <div className="d-flex flex-grow-1 position-relative">
        
        {/* Sidebar */}
        <AdminSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

        {/* ORIGINAL overlay — keeps your old behavior */}
        {showSidebar && (
          <div
            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div className="admin-content container py-4">
          <h2 className="mb-4">Add New Book</h2>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Book Title</label>
              <input type="text" name="title" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Author</label>
              <input type="text" name="author" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Price</label>
              <input type="number" name="price" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label">Category</label>
              <input type="text" name="genre" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows="3" onChange={handleChange}></textarea>
            </div>

            <div className="col-md-12">
              <label className="form-label">Book Image</label>
              <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} required />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary px-4">Add Book</button>
            </div>
          </form>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={1500}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">Book Added Successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ERROR MODAL */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Something went wrong while adding the book.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default AddBook;
