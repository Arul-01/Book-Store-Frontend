import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import AdminNavbar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";
import { useParams, useNavigate } from "react-router-dom";
import { Toast, ToastContainer, Modal, Button } from "react-bootstrap";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // NEW State
  const [showToast, setShowToast] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch Existing Book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) formData.append("images", image);

    try {
      await api.put(
        `/books/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowToast(true);
      setTimeout(() => navigate("/admin/books"), 1500);
    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />

      <div className="d-flex flex-grow-1 position-relative">
        <AdminSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

        {showSidebar && (
          <div
            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        <div className="container py-4">
          <h2>Edit Book</h2>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Author</label>
              <input
                name="author"
                className="form-control"
                value={form.author}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Category</label>
              <input
                name="genre"
                className="form-control"
                value={form.genre}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-md-12">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="col-12 text-end">
              <button className="btn btn-primary px-4" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          delay={1500}
          onClose={() => setShowToast(false)}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">
            Book Updated Successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ERROR MODAL */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>Unable to update this book. Try again!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditBook;
