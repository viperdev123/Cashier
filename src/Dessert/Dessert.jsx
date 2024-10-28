import React, { useState, useEffect } from "react";
import Delete from "../assets/Delete.png";
import expand from "../assets/ExpandArrow.png";
import "../Order/OrderSoda.css";
import banoffee from "../assets/banoffee.png";
import dubai from "../assets/dubai.png"

// Mapping of soda names to their image URLs
const TeaImages = {
  "banoffee": banoffee,
  "chocolate dubai": dubai
};

function Order() {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [orderDetails, setOrderDetails] = useState([]); // State to hold order details
  const [showDetails, setShowDetails] = useState(null); // State to manage visibility of details
  const [status, setStatus] = useState("not-started"); // State for order status

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersResponse = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1lxwIXRhZGW7-OJ7b5naD3jV83FgEoaNfNuYtFhgsFT0/values/Dessert!A1:Z1000?key=AIzaSyCxoYDs3MtxkZfqFgwPZLS5qn7Z0NQK57Q"
      );
      if (!ordersResponse.ok) {
        throw new Error("Failed to fetch orders: " + ordersResponse.statusText);
      }
      const ordersData = await ordersResponse.json();
      const fetchedOrders = ordersData.values.slice(1); // Skip header row

      // Sort orders by OrderID (new to old)
      const sortedOrders = fetchedOrders.sort((a, b) => {
        const idA = parseInt(a[0]); // Assuming OrderID is in the 1st column (index 0)
        const idB = parseInt(b[0]);
        return idB - idA; // Sort in descending order
      });

      setOrders(sortedOrders);
    };

    const fetchOrderDetails = async () => {
      const detailsResponse = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/12Aeg4-g0Aw3eXLSQAxKl4kvedwqlO11LrPx1cykc4w4/values/OrderDetailDessert!A1:Z1000?key=AIzaSyCxoYDs3MtxkZfqFgwPZLS5qn7Z0NQK57Q"
      );
      if (!detailsResponse.ok) {
        throw new Error(
          "Failed to fetch order details: " + detailsResponse.statusText
        );
      }
      const detailsData = await detailsResponse.json();
      
      // Log the entire response for debugging
      console.log("Order details response:", detailsData);

      // Check if values exist before slicing
      if (detailsData.values) {
        setOrderDetails(detailsData.values.slice(1)); // Skip header row
      } else {
        console.error("No order details found in response");
        setOrderDetails([]); // Set to empty array if no values
      }
    };

    const intervalId = setInterval(() => {
      fetchOrders();
      fetchOrderDetails();
    }, 10000); // Fetch data every 10 seconds

    fetchOrders();
    fetchOrderDetails();

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Function to toggle details for a specific order
  const toggleDetails = (orderId) => {
    setShowDetails((prev) => (prev === orderId ? null : orderId)); // Toggle visibility for specific order
  };

  // Function to handle status change
  const handleChange = (event) => {
    setStatus(event.target.value);
  };


  return (
    <div className="container-order">
      {orders.map((order) => (
        <div key={order[0]} className="container-dropdown">
          <div className="wrap-box">
            <div className="p-ordername">
              <p className="dropdown-p">Name for order:</p>
              <h3 className="order-name">{order[1]}</h3>
            </div>
            <div className="order-total">
              <div className="dropdown-p">Total:</div>
              <div className="total">{order[2]} THB</div> {/* Total Price */}
            </div>
            <select
              className={`process ${status}`}
              value={status}
              onChange={handleChange}
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button className="delete-order">
              <img className="img-delete" src={Delete} alt="Delete" />
            </button>
            <button className="detail" onClick={() => toggleDetails(order[0])}>
              <img className="detail-img" src={expand} alt="Expand" />
            </button>
          </div>
          {showDetails === order[0] && (
            <div className={`details-content show`}>
              {orderDetails
                .filter((detail) => detail[1] === order[0]) // Filter details by OrderId
                .map((detail) => (
                  <div className="order-detail-content" key={detail[0]}>
                    <div className="container-image-menu">
                      <img
                        className="image-menu"
                        src={TeaImages[detail[2]]}
                        alt={detail[2]}
                      />{" "}
                      {/* Tea Image */}
                    </div>
                    <div className="wrap-name-price">
                      <p className="name-menu">{detail[2]}</p> {/* Soda Name */}
                      <div className="wrap-price-curr">
                        <p className="price-menu">{detail[4]}</p>{" "}
                        {/* Price Per Cup */}
                        <p className="currency">THB</p>
                      </div>
                    </div>
                    <div className="wrap-amount">
                      <p className="amount">{detail[3]}</p> {/* Quantity */}
                      <p className="pieces">pieces</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Order;
