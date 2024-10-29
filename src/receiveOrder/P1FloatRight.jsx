import ItemAllKeep from "./ItemAllKeep";
import "./P1FloatRight.css";
import { useState, useEffect } from "react";
import axios from "axios";

function P1FloatRight({ cart, addToCart, setCart, productType }) {
  const [orderName, setOrderName] = useState(""); // New state for order name
  const [currentOrder, setCurrentOrder] = useState(null); // New state for current order
  const [latestDetailIDs, setLatestDetailIDs] = useState({
    tea: null,
    soda: null,
    dessert: null,
  });

  useEffect(() => {
    const types = productType.map((item) => item.type);
    const currentType = types[0];

    const fetchLatestIDs = async () => {
      try {
        // Fetch latest OrderID
        const orderEndpoint =
          currentType === "tea"
            ? "/latest-order-id/tea"
            : currentType === "soda"
            ? "/latest-order-id/soda"
            : currentType === "dessert"
            ? "/latest-order-id/dessert"
            : null;

        // Fetch latest DetailID
        const detailEndpoint =
          currentType === "tea"
            ? "/latest-detail-id/tea"
            : currentType === "soda"
            ? "/latest-detail-id/soda"
            : currentType === "dessert"
            ? "/latest-detail-id/dessert"
            : null;

        if (orderEndpoint && detailEndpoint) {
          const [orderResponse, detailResponse] = await Promise.all([
            axios.get(`http://localhost:3000${orderEndpoint}`),
            axios.get(`http://localhost:3000${detailEndpoint}`),
          ]);

          const incrementedOrderID =
            parseInt(orderResponse.data.latestOrderID, 10) + 1;
          setCurrentOrder(incrementedOrderID);

          // Update the latestDetailIDs state with the fetched detail ID
          setLatestDetailIDs((prev) => ({
            ...prev,
            [currentType]: parseInt(detailResponse.data.latestDetailID, 10),
          }));

          console.log(
            `Fetched and incremented Order ID for ${currentType}:`,
            incrementedOrderID
          );
          console.log(
            `Fetched Detail ID for ${currentType}:`,
            detailResponse.data.latestDetailID
          );
        }
      } catch (error) {
        console.error("Error fetching latest IDs:", error);
      }
    };

    fetchLatestIDs();
    const intervalId = setInterval(fetchLatestIDs, 7000);

    return () => clearInterval(intervalId);
  }, [productType]);

  const removeFromCart = (index) => {
    setCart((prevItems) => {
      const newItems = [...prevItems]; // Create a copy of the cart
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const sendOrderData = async (cart) => {
    const { items, orderID } = cart;

    // Group items by type
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    // Function to send data to the server
    const sendData = async (type, orderData) => {
      try {
        const response = await axios.post(
          `http://localhost:3000/add-order/${type}`,
          orderData
        );
        console.log(`Order added successfully to ${type} tab:`, response.data);
      } catch (error) {
        console.error(`Error adding order to ${type} tab:`, error);
      }
    };

    // Iterate over each type and send data
    for (const [type, items] of Object.entries(groupedItems)) {
      const totalPrice = items.reduce((total, item) => total + item.plice, 0);
      const totalCups = items.length;
      const orderName = items[0].customer || "Anonymous"; // Assuming all items have the same customer name

      const orderData = {
        OrderID: orderID,
        OrderName: orderName,
        TotalPrice: totalPrice,
        TotalCups: totalCups,
      };

      await sendData(type, orderData);
    }
  };

  const sendOrderDetails = async (cart, orderID) => {
    let currentDetailIDs = { ...latestDetailIDs }; // Start with the latest fetched IDs

    // Group items by type
    const groupedItems = cart.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});

    // Send details for each type
    for (const [type, items] of Object.entries(groupedItems)) {
      for (const item of items) {
        // Use the fetched latestDetailIDs as the base, defaulting to 0 if not found
        // currentDetailIDs[type] = (currentDetailIDs[type] || 0) + 1;
        // console.log("Current DetailID for", type, ":", currentDetailIDs[type]);

        const detailData = {
          DetailId: 1,
          OrderId: orderID,
          ProductName: item.name,
          Quantity: 1, // Since each item is individual in the cart
          PricePerCup: item.plice,
        };

        try {
          await axios.post(
            `http://localhost:3000/add-order-detail/${type}`,
            detailData
          );
          console.log(`Detail added successfully for ${type}:`, detailData);
        } catch (error) {
          console.error(`Error adding detail for ${type}:`, error);
          throw error; // Re-throw the error to be caught by handleOrderNow
        }
      }
    }
  };

  const handleOrderNow = async () => {
    if (cart.length === 0) {
      console.log("Cannot place order: cart is empty.");
      return;
    }

    const orderWithCustomer = {
      items: cart.map((item) => ({ ...item, customer: orderName })),
      orderID: currentOrder,
    };

    try {
      await sendOrderData(orderWithCustomer); // Send order summary
      await sendOrderDetails(cart, currentOrder); // Send order details
      setCart([]);
      setOrderName("");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const itemElements = cart.map((item, index) => {
    return (
      <ItemAllKeep
        key={index}
        tea={item}
        index={index}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
    );
  });

  return (
    <div className="box-float-right">
      <div className="box-all-keep-bill">{itemElements}</div>
      <div className="Order-name-wrap">
        <div className="h4">Name for order</div>
        <input
          className="keep-name"
          type="text"
          id="order-name"
          placeholder="Order Name"
          value={orderName} // Bind input value to orderName state
          onChange={(e) => setOrderName(e.target.value)} // Update orderName on input change
        ></input>
      </div>
      <div className="wrap-total-order">
        <div className="total-x">
          <span className="f2">Total</span>
          <span className="f6">x{cart.length}</span>
        </div>
        <div className="total-price-amount">
          <span className="f5" id="a">
            {cart.reduce(
              (total, item) => total + parseFloat(item.plice || 0),
              0
            )}
          </span>
          <span className="f4" id="a">
            THB
          </span>
        </div>
      </div>
      <div className="wrap-order-now">
        {currentOrder && (
          <div className="current-order">Current Order ID: {currentOrder}</div>
        )}
        <div className="orderNow" onClick={handleOrderNow}>
          Order Now
        </div>
      </div>
    </div>
  );
}

export default P1FloatRight;

const KeepBill = [
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
  {
    nameBill: "",
    name: "",
    plice: "",
    numnumber: "",
  },
];
