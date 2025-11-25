import Home from "./Home";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import BookList from "./pages/BookList";
import BookDetails from "./pages/BoookDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrdersList from "./pages/admin/orders/OrdersList";
import UsersList from "./pages/admin/users/UsersList";
import ManageBooks from "./pages/admin/books/ManageBooks";
import AddBook from "./pages/admin/books/AddBook";
import EditBook from "./pages/admin/books/EditBook";



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<BookList />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrdersList />
              </AdminRoute>
            }
          />
            <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersList />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <ManageBooks/>
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/add-book"
            element={
              <AdminRoute>
                <AddBook/>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit-book/:id"
            element={
              <AdminRoute>
                <EditBook/>
              </AdminRoute>
            }
          />
      
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
