import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import AdminNavbar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";
import "../../../styles/admin.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);
  const token = localStorage.getItem("token");

  const getJoinDate = (id) => {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    return new Date(timestamp).toLocaleDateString();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  };

  const handleDelete = async () => {
    try {
      setUsers((prev) => prev.map((u) => (u._id === deleteId ? { ...u, isDeleting: true } : u)));
      setTimeout(async () => {
        await api.delete(`/users/${deleteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((u) => u._id !== deleteId));
        setDeleteId(null);
        const toast = new window.bootstrap.Toast(document.getElementById("deleteToast"));
        toast.show();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  // Define Header Style Object for reusability
  const headerStyle = {
    backgroundColor: "rgb(0, 0, 0)", // Black Background
    color: "rgb(255, 255, 255)",     // White Text
    borderBottom: "none"
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1 position-relative">
        <AdminSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

        {showSidebar && (
          <div 
            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ zIndex: 1040, opacity: 0.5 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        <main className="flex-grow-1 p-3 p-md-4 bg-light" style={{ minWidth: 0 }}>
          <h2 className="mb-4">Users List</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="table-responsive shadow-sm bg-white rounded">
              <table className="table mb-0 align-middle" style={{ whiteSpace: "nowrap" }}>
                <thead>
                  <tr>
                    {/* Applied Black Background and White Text explicitly to every header cell */}
                    <th style={headerStyle}>Name</th>
                    <th style={headerStyle}>Email</th>
                    <th style={headerStyle}>Role</th>
                    <th style={headerStyle}>Joined</th>
                    <th style={headerStyle}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr 
                      key={u._id} 
                      className={u.isDeleting ? "fade-out" : ""}
                      // Alternating RGB colors for the list body
                      style={{ backgroundColor: index % 2 === 0 ? "rgb(255, 255, 255)" : "rgb(225, 225, 225)" }}
                    >
                      <td style={{ backgroundColor: "inherit" }}>{u.name}</td>
                      <td style={{ backgroundColor: "inherit" }}>{u.email}</td>
                      <td style={{ backgroundColor: "inherit" }}>
                        {u.role === "admin" ? (
                          <span className="badge bg-primary">Admin</span>
                        ) : (
                          <span className="badge bg-secondary">User</span>
                        )}
                      </td>
                      <td style={{ backgroundColor: "inherit" }}>{getJoinDate(u._id)}</td>
                      <td style={{ backgroundColor: "inherit" }}>
                        <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(u._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal & Toast Code remains same */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Are you sure?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div id="deleteToast" className="toast position-fixed top-0 end-0 m-3 bg-success text-white" role="alert">
        <div className="toast-body">User deleted successfully!</div>
      </div>
    </div>
  );
}

export default UsersList;