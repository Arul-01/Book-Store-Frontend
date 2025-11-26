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
    <nav className="navbar navbar-dark bg-dark px-4 sticky-top shadow navbar-expand-md">
      <div className="container-fluid">

        {/* MOBILE SIDEBAR TOGGLE */}
        <button
          className="btn btn-outline-dark btn-dark d-md-none me-3"
          onClick={onToggleSidebar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* BRAND */}
        <a className="navbar-brand d-flex align-items-center text-dark">
          <img
            src="/logo.png"
            alt="Logo"
            className="rounded me-2"
            style={{ height: "40px" }}
          />
          Admin Panel
        </a>

        {/* COLLAPSE BUTTON WHEN SCREEN SMALL */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSIBLE MENU */}
        <div className="collapse navbar-collapse" id="adminNavbarMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-3">

            <li className="nav-item">
              <a className="nav-link fw-bold text-dark" href="/">
                Home
              </a>
            </li>

            <li className="nav-item">
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default AdminNavbar;
