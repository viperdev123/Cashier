import ItemAllKeep from "./ItemAllKeep";
import "./P1FloatRight.css";
import { useState } from "react";

function P1FloatRight({ cart, addToCart, setCart }) {
  const [orderName, setOrderName] = useState(""); // New state for order name

  const removeFromCart = (index) => {
    setCart((prevItems) => {
      const newItems = [...prevItems]; // สร้าง copy ของตะกร้า
      newItems.splice(index, 1); // ลบรายการที่ตำแหน่ง index
      return newItems;
    });
  };

  const handleOrderNow = () => {
    if (cart.length === 0) {
      console.log("Cannot place order: cart is empty."); // Log a message if the cart is empty
      return; // Exit the function if there are no items in the cart
    }

    const orderWithCustomer = {
      items: cart.map(item => ({ ...item, customer: orderName })) // Add customer to each item
    };
    console.log("Order placed:", orderWithCustomer);
    setCart([]); // Clear the cart after placing the order
    setOrderName(""); // Clear the name value after placing the order
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
      <div className="h4">Name for order</div>

      <input
        className="keep-name"
        type="text"
        id="order-name"
        placeholder="Order Name"
        value={orderName} // Bind input value to orderName state
        onChange={(e) => setOrderName(e.target.value)} // Update orderName on input change
      ></input>

      <span className="f2">Total</span>
      <span className="f6">x{cart.length}</span>
      <span className="f5" id="a">
        {cart.reduce((total, item) => total + item.plice, 0)}
      </span>
      <span className="f4" id="a">
        THB
      </span>
      <div className="orderNow" onClick={handleOrderNow}>
        Order Now
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
