import React from "react";
import { NavLink } from "react-router-dom";

function AdminSidebar({ show, onClose }) {
  // Styles for Dark & Neat look
  const sidebarStyle = {
    backgroundColor: "#212529", // Dark background
    color: "#f8f9fa",
    minHeight: "100vh",
    transition: "transform 0.3s ease-in-out",
    // FIX: Only apply high z-index on mobile when shown. 
    // On desktop (default), use 'auto' so it sits below the navbar.
    zIndex: show ? 1050 : "auto", 
  };

  const linkStyle = {
    color: "#adb5bd", // Muted text
    border: "none",
    transition: "all 0.2s",
  };

  const activeLinkStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Glassy highlight
    color: "#ffffff",
    fontWeight: "600",
    borderLeft: "4px solid #0d6efd", // Blue accent
  };

  return (
    <>
      <div
        className={`
          border-end border-secondary 
          d-md-block 
          ${show ? "d-block position-fixed top-0 start-0 h-100 shadow-lg" : "d-none"} 
          col-md-3 col-lg-2
        `}
        style={sidebarStyle}
      >
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
            <h5 className="fw-bold mb-0 text-white">Admin Panel</h5>
            {/* Close button (Mobile Only) */}
            <button
              className="btn btn-close btn-close-white d-md-none"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="list-group list-group-flush">
            <NavLink
              to="/admin/dashboard"
              className="list-group-item list-group-item-action bg-transparent py-3"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
              onClick={onClose}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              className="list-group-item list-group-item-action bg-transparent py-3"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
              onClick={onClose}
            >
              Manage Users
            </NavLink>

            <NavLink
              to="/admin/books"
              className="list-group-item list-group-item-action bg-transparent py-3"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
              onClick={onClose}
            >
              Manage Books
            </NavLink>

            <NavLink
              to="/admin/orders"
              className="list-group-item list-group-item-action bg-transparent py-3"
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
              onClick={onClose}
            >
              Manage Orders
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;