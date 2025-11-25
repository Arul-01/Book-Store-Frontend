import React from "react";
import Navbar from "./components/Navbar"; 
import BookList from "./pages/BookList";
import './home.css';
import Footer from "./components/Footer";
import {useState} from "react";

function Home() {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <Navbar  onSearch={(text) => setSearchText(text)}/>
      
      <div className="container mt-3">
        <div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="Screenshot (76).png" className="d-block w-100" alt="1st slide" />
            </div>
            <div className="carousel-item">
              <img src="banner2.png" className="d-block w-100" alt="2nd slide" />
            </div>
            <div className="carousel-item">
              <img src="Screenshot 2025-10-29 211044.png" className="d-block w-100" alt="3rd slide" />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <BookList searchText={searchText}/>
      <Footer/>
    </>
  );
}

export default Home;
