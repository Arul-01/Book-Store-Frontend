import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  Table,
  Button,
  Spinner,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import AdminNavbar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";
import { Link } from "react-router-dom";

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSidebar, setShowSidebar] = useState(false);

  // Delete Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Toast
  const [showToast, setShowToast] = useState(false);

  const token = localStorage.getItem("token");

  // -------------------------------
  // FETCH BOOKS (NO ESLINT WARNINGS)
  // -------------------------------
  useEffect(() => {
    const fetchBooks = async () => {
      try { 
        const res = await api.get("/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // No dependencies = no warning

  // -------------------------------
  // OPEN DELETE MODAL
  // -------------------------------
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // -------------------------------
  // DELETE BOOK
  // -------------------------------
  const deleteBook = async () => {
    try {
      await api.delete(`/books/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(books.filter((b) => b._id !== deleteId));

      setShowDeleteModal(false);

      // Delay toast slightly to ensure modal closes first
      setTimeout(() => setShowToast(true), 80);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <AdminNavbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />

      <div className="d-flex">
        {/* SIDEBAR */}
        <AdminSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

        {/* MOBILE BACKDROP */}
        {showSidebar && (
          <div
            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* MAIN CONTENT */}
        <div className="container mt-4">
          <h2 className="fw-bold mb-4">Manage Books</h2>
           <Button
  as={Link}
  to="/admin/add-book"
  variant="primary"
  className="float-end mb-3" // or whatever positioning you want
>
  Add Book
</Button>
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive">
  <Table bordered hover className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Genre</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={book.images?.[0]}
                        alt="book-img"
                        style={{
                          width: "60px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>

                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>₹{book.price}</td>
                    <td>{book.genre}</td>

                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        href={`/admin/edit-book/${book._id}`}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openDeleteModal(book._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* -------------------------------- */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete this book?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>

        <Button variant="danger" onClick={deleteBook}>
          Yes, Delete
        </Button>
      </Modal.Footer>
      </Modal>

      {/* -------------------------------- */}
      {/* SUCCESS TOAST (BOTTOM RIGHT) */}
      {/* -------------------------------- */}
      <ToastContainer
        position="bottom-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={showToast}
          autohide
          delay={2500}
          bg="success"
          onClose={() => setShowToast(false)}
        >
          <Toast.Body className="text-white fw-bold">
            Book Deleted Successfully ✔
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ManageBooks;
