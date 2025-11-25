import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCartShopping,
  faCircleUser,
  faUser,
  faGear,
  faBoxOpen,
  faRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap"; // 1. Import Toast
import "../styles/Navbar.css";

function Navbar({ Search = true, Cart = true, onSearch }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  // --- 2. Toast State ---
  const [showToast, setShowToast] = useState(false);

  // --- Cart Count Logic ---
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // --- 3. Updated Logout Logic ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Show success toast
    setShowToast(true);

    // Delay navigation slightly so user sees the message
    setTimeout(() => {
      navigate("/");
      // Optional: Reload to clear any specific user states if necessary
      // window.location.reload(); 
    }, 1500);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 1000);
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleInput = (e) => {
    const text = e.target.value;
    setSearchTerm(text);
    if (onSearch) onSearch(text);
  };

  return (
    <nav className="navbar navbar-expand-md bg-light bg-opacity-75 container-fluid position-relative">
      
      {/* --- 4. Toast Container --- */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, position: 'fixed' }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide bg="success">
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Logged out successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <img
            src="/logo.png"
            alt="logo"
            className="logo-image rounded"
            style={{ height: "50px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>
        {Search && (
          <div className="d-md-none ms-auto me-2">
            <button
              className="btn btn-dark"
              onClick={() => setShowSearch(!showSearch)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        )}

        <button
          className="navbar-toggler bg-dark text-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="d-flex flex-column flex-md-row align-items-end align-items-md-center  justify-content-between w-100 gap-3 mt-3 mt-md-0">
            <ul className="navbar-nav fw-bold ">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact
                </a>
              </li>
            </ul>

            {Search && (
              <div className="col-md-5 d-none d-md-block">
                <div className="input-group">
                  <input
                    type="search"
                    placeholder="Search By Title, Author, Publisher Or ISBN"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleInput}
                  />
                  <button className="btn btn-dark text-light" type="button">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
            )}

            <div className="col-3 col-md-2 d-flex justify-content-end align-items-center">
              <div className="d-flex flex-column flex-sm-row align-items-center gap-3 me-0 me-md-5">
                {Cart && (
                  <button
                    className="btn text-light bg-dark position-relative"
                    onClick={handleCartClick}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    )}
                  </button>
                )}

                {token ? (
                  <div
                    className="profile-dropdown position-relative mt-2 mt-md-0"
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                  >
                    <div>
                      <FontAwesomeIcon icon={faCircleUser} size="2x" />
                    </div>
                    {showDropdown && (
                      <div
                        className="dropdown-content text-center shadow p-3 mt-2 bg-white rounded position-absolute end-0 animate-search"
                        style={{ display: showDropdown ? "block" : "none" }}
                      >
                        <div className="pt-2 fw-bold">
                          <p>
                            <FontAwesomeIcon icon={faUser} />
                            &nbsp;{user?.name || "Unknown User"}
                          </p>
                        </div>
                        <hr />
                        <button
                          className="btn btn-link  text-decoration-none text-dark"
                          onClick={() => navigate("/settings")}
                        >
                          <FontAwesomeIcon icon={faGear} /> Personal Settings
                        </button>
                        <button
                          className="btn btn-link text-decoration-none text-dark"
                          onClick={() => navigate("/orders")}
                        >
                          <FontAwesomeIcon icon={faBoxOpen} /> My Orders
                        </button>
                        <button
                          className="btn btn-link text-decoration-none text-danger"
                          onClick={handleLogout}
                        >
                          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="btn text-light bg-dark mt-2 mt-md-0"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {showSearch && (
          <div
            className="position-absolute top-100 start-0 w-100 bg-light p-3 border-top animate-search"
            style={{ zIndex: 1 }}
          >
            <div className="input-group">
              <input
                type="search"
                placeholder="Search By Title, Author, Publisher Or ISBN"
                className="form-control" value={searchTerm}
                    onChange={handleInput}
                autoFocus
              />
              <button className="btn btn-dark text-light" type="button">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;