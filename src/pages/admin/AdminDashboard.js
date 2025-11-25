import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import api from "../../api/axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State to toggle sidebar on mobile
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Safe toggle function
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(res.data.length);

        const sortedUsers = res.data
          .sort(
            (a, b) =>
              new Date(parseInt(b._id.substring(0, 8), 16) * 1000) -
              new Date(parseInt(a._id.substring(0, 8), 16) * 1000)
          )
          .slice(0, 5);

        setRecentUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setTotalBooks(res.data.length);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalOrders(res.data.length);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Pass the toggle function to Navbar */}
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1 position-relative">
        
        {/* Pass state to Sidebar */}
        <AdminSidebar show={showSidebar} onClose={() => setShowSidebar(false)} />

        {/* Overlay: Visible only on mobile when sidebar is open */}
        {showSidebar && (
          <div 
            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark" 
            style={{ zIndex: 1040, opacity: 0.5 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        {/* Main Content: Added minWidth: 0 to prevent table overflow issues */}
        <main className="flex-grow-1 p-3 p-md-4 bg-light" style={{ minWidth: 0 }}>
          <h2 className="mb-4">Admin Dashboard</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card text-center text-white bg-warning shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text display-6 mb-0">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center text-white bg-primary shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h5 className="card-title">Total Books</h5>
                  <p className="card-text display-6 mb-0">{totalBooks}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center text-white bg-success shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-center">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="card-text display-6 mb-0">{totalOrders}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-5 shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Recent Users</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                {/* Added whiteSpace: nowrap so table doesn't break layout on mobile */}
                <table className="table table-hover mb-0 align-middle" style={{ whiteSpace: "nowrap" }}>
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-3">
                          No recent users
                        </td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {new Date(
                              parseInt(user._id.substring(0, 8), 16) * 1000
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;