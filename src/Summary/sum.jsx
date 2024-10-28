import React, { useState, useEffect } from "react";
import "./sum.css"

function Sum() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCups, setTotalCups] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/1lxwIXRhZGW7-OJ7b5naD3jV83FgEoaNfNuYtFhgsFT0/values/Soda!A1:Z1000?key=AIzaSyCxoYDs3MtxkZfqFgwPZLS5qn7Z0NQK57Q");
      if (!response.ok) {
        throw new Error("Failed to fetch orders: " + response.statusText);
      }
      const data = await response.json();
      const orders = data.values.slice(1); // Skip header row

      // Calculate totals
      let amount = 0;
      let ordersCount = 0;
      let cupsCount = 0;

      orders.forEach(order => {
        const totalPrice = parseFloat(order[2]) || 0; // TotalPrice
        const totalCups = parseInt(order[3]) || 0; // TotalCups

        amount += totalPrice;
        ordersCount += 1; // Count each order
        cupsCount += totalCups; // Sum total cups
      });

      setTotalAmount(amount);
      setTotalOrders(ordersCount);
      setTotalCups(cupsCount);
    };

    const intervalId = setInterval(() => {
      fetchOrders(); // Fetch orders every 5 seconds
    }, 5000); // Adjust the interval as needed

    fetchOrders(); // Initial fetch

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="container-summary">
      <div className="Tamount-Ttorder-Tcup">
        <div className="total-amount">
          <p className="total-p">Total amount</p>
          <div className="to-price-currency">
            <p className="ta-price">{totalAmount}</p>
            <p className="currency">THB</p>
          </div>
        </div>
        <div className="total-order">
          <p className="total-p">Total Order</p>
          <div className="to-price-currency">
            <p className="ta-order">{totalOrders}</p>
            <p className="currency">Order</p>
          </div>
        </div>
        <div className="total-cup">
          <p className="total-p">Total Cups</p>
          <div className="to-price-currency">
            <p className="ta-pieces">{totalCups}</p>
            <p className="Pieces">Pieces</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sum;
