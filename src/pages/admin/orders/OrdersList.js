import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import AdminNavbar from "../AdminNavbar";
import AdminSidebar from "../AdminSidebar";

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const updatePaidStatus = async (orderId, currentStatus) => {
    try {
      const res = await api.patch(
        `/orders/${orderId}`,
        { isPaid: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI without reload
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, isPaid: !currentStatus } : o
        )
      );
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  // Style object for the Black Header
  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1 position-relative">
        <AdminSidebar
          show={showSidebar}
          onClose={() => setShowSidebar(false)}
        />

        {showSidebar && (
          <div
            className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ zIndex: 1040, opacity: 0.5 }}
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        <main
          className="flex-grow-1 p-3 p-md-4 bg-light"
          style={{ minWidth: 0 }}
        >
          <h2 className="mb-4">Orders List</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="table-responsive shadow-sm bg-white rounded">
              <table
                className="table table-hover mb-0 align-middle"
                style={{ whiteSpace: "nowrap" }}
              >
                {/* UPDATED: Removed table-light class and applied custom styles */}
                <thead>
                  <tr>
                    <th style={headerStyle}>User</th>
                    <th style={headerStyle}>Items</th>
                    <th style={headerStyle}>Total</th>
                    <th style={headerStyle}>Method</th>
                    <th style={headerStyle}>Status</th>
                    <th style={headerStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.user?.name || "Unknown"}</td>

                      <td>
                        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                          {order.orderItems.map((item) => (
                            <div key={item._id} className="small text-muted">
                              {item.title} x {item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>₹{order.totalAmount}</td>

                      <td>{order.paymentMethod}</td>

                      {/* STATUS COLUMN */}
                      <td>
                        {order.isPaid ? (
                          <span className="badge bg-success">Paid</span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Not Paid
                          </span>
                        )}

                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => updatePaidStatus(order._id, order.isPaid)}
                        >
                          {order.isPaid ? "Mark Unpaid" : "Mark Paid"}
                        </button>
                      </td>

                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default OrdersList;