import "../styles/auth.css";
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password);

    api
      .post("/users/register", {
        name,
        email,
        password,
      })
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <Navbar/>
    <div className="login">
      <div className="container d-flex flex-column align-items-center blur-box">
        <h2>Register Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="name"
              className="form-control"
              id="email"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control "
              id="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div class="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control "
              id="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-success mt-3 w-100" type="submit">
              Register
            </button>
          </div>
          <br />
        </form>
      </div>
    </div>
    </div>
  );
}
export default Register;
