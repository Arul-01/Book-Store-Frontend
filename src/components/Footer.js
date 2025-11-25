import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container text-center text-md-start">
        <div className="row">
         
          <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-4">
            <h5 className="text-uppercase fw-bold mb-3" style={{color:"rgb(191, 162, 96)"}}>Classic Reads</h5>
            <p>
              Discover your next great read. We bring you the best books from
              authors all around the world. All in one place.
            </p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-3" style={{color:"rgb(191, 162, 96)"}}>Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/books" className="text-light text-decoration-none">Books</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-3" style={{color:"rgb(191, 162, 96)"}}>Useful Links</h6>
            <ul className="list-unstyled">
              <li><a href="/profile" className="text-light text-decoration-none">My Account</a></li>
              <li><a href="/orders" className="text-light text-decoration-none">Orders</a></li>
              <li><a href="/help" className="text-light text-decoration-none">Help</a></li>
              <li><a href="/policy" className="text-light text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 text-center">
            <h6 className="text-uppercase fw-bold mb-3" style={{color:"rgb(191, 162, 96)"}}>Follow Us</h6>
            <div>
              <a href="#" className="text-light me-3 fs-4"><FaFacebook /></a>
              <a href="#" className="text-light me-3 fs-4"><FaInstagram /></a>
              <a href="#" className="text-light me-3 fs-4"><FaTwitter /></a>
              <a href="#" className="text-light fs-4"><FaGithub /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-3 border-top border-secondary mt-3">
        <p className="mb-0">
         Copyright &copy; &nbsp;{new Date().getFullYear()} <strong>Classic Reads</strong> | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
