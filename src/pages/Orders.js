import React, { useEffect, useState } from "react";
import api from "../api/axios";

import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await api.get(
          "/orders/myorders",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders(data);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Unauthorized! Please login.");
          navigate("/login");
        }
        console.log("Error loading orders", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar Search={false} Cart={false} />
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center text-secondary fs-5 mt-5">
          You have no orders yet.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Shipping</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td className="fw-bold">{index + 1}</td>

                  <td className="text-break" style={{ maxWidth: "180px" }}>
                    <span className="badge bg-dark">{order._id}</span>
                  </td>

                  <td>
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="mb-1">
                        <span className="fw-semibold">
        {item.title}
      </span>
                        <span className="badge bg-info text-dark ms-1">
                          x&nbsp;{item.quantity}
                        </span>
                      </div>
                    ))}
                  </td>

                  <td>
                    <span className="badge bg-success fs-6">
                      ₹{order.totalAmount}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        "badge px-3 py-2 fw-bold " +
                        (order.isPaid ? "bg-success" : "bg-warning text-dark")
                      }
                    >
                      {order.isPaid ? "Paid" : "COD"}
                    </span>
                  </td>

                  <td>
                    <span className="badge bg-secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="text-break" style={{ maxWidth: "200px" }}>
                    {order.shippingAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
};

export default Orders;
