import { Link } from "react-router-dom";
import "../styles/auth.css";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toast, ToastContainer } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- Toast States ---
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger"); // 'success' or 'danger'

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);

    api
      .post("/users/login", {
        email,
        password,
      })
      .then((result) => {
        console.log(result);

        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));

        // --- Success Toast Logic ---
        setToastVariant("success");
        setToastMessage("Login Successful! Redirecting...");
        setShowToast(true);

        // Delay navigation slightly so user sees the toast
        setTimeout(() => {
          if (result.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        // --- Error Toast Logic ---
        setToastVariant("danger");
        if (err.response && err.response.status === 401) {
          setToastMessage("Invalid email or password");
        } else {
          setToastMessage("Something went wrong. Please try again later.");
        }
        setShowToast(true);
      });
  };

  return (
    <div>
      <Navbar />

      {/* --- Toast Container --- */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, position: 'fixed' }}>
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide 
          bg={toastVariant} // Dynamic background color
        >
          <Toast.Header>
            <strong className={`me-auto ${toastVariant === 'success' ? 'text-success' : 'text-danger'}`}>
              {toastVariant === 'success' ? "Success" : "Login Failed"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="login">
        <div className="container d-flex flex-column align-items-center blur-box">
          <h2>Login Page</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control "
                id="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control "
                id="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-primary mt-3 w-100">Login</button>{" "}
            </div>
            <br />
            <div className="d-flex gap-2 align-items-center">
              <p className="mt-3 ">New User?</p>
              <Link to="/register">
                <button className="btn btn-warning ">Sign up</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;