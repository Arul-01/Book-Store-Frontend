import React from "react";
import { useNavigate } from "react-router-dom";

function AdminNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  

  return (
    <nav className="navbar navbar-dark bg-dark px-4 sticky-top shadow">
      <div className="d-flex align-items-center">
        {/* Toggle Button: Visible only on mobile (d-md-none) */}
        <button 
          className="btn btn-outline-dark btn-dark d-md-none me-3" 
          onClick={onToggleSidebar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-brand text-white mb-0 h1 d-flex align-items-center">
           {/* Assuming logo exists, added fallback text if image fails */}
           <img src="/logo.png" alt="Logo" className="rounded me-2" style={{ height: "40px" }} />
           Admin Panel
        </div>
      </div>

      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;