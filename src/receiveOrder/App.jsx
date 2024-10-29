import { useState } from "react";
import "./App.css";
import P1FloatLeft from "./P1FloatLeft";
import P1FloatRight from "./P1FloatRight";
import { teas, drinks, desserts } from "./data/product";
import { Link } from "react-router-dom";
import cir1 from "../assets/cir.png";
import cir2 from "../assets/cir2.png";
import cir3 from "../assets/cir3.png";

function App() {
  const [productType, setProductType] = useState(teas);
  const [cart, setCart] = useState([]); // สร้าง state สำหรับตะกร้า

  function handleTypeOfProduct(type) {
    setProductType(type);
  }

  const clear = () => {
    setCart([]);
  };

  // ฟังก์ชันสำหรับเพิ่มสินค้าในตะกร้า
  function addToCart(tea) {
    setCart((prevCart) => [...prevCart, tea]);
  }

  return (
    <div className="container-app">
      <div className="p1-header">
        <img className="cir1" src={cir1} alt="" />
        <img className="cir2" src={cir2} alt="" />
        <img className="cir3" src={cir3} alt="" />
        <div className="container-history-btn"> 
          <Link to="/soda" className="change-HistoryBill">
            <h1 className="h1">History Bills</h1>
            <img className="img-header-history" src="/images/img-header-history.png" />
        </Link>
        </div>
        <div className="grid-type">
          <button className="type-tea" onClick={() => handleTypeOfProduct(teas)} style={{ background: "#FFEF92" }} >
            <div className="h2">TEA</div>
            <img className="img-type-tea" src="/images/img-type-tea.png"></img>
          </button>
          <button className="type-drink" onClick={() => handleTypeOfProduct(drinks)} style={{ background: "#b6d7cf" }}>
            <h2 className="h2">DRINK</h2>
            <img className="img-type-drink" src="/images/img-type-drink.png" ></img>
          </button>
          <button className="type-dessert" onClick={() => handleTypeOfProduct(desserts)} style={{ background: "#f5cac3" }}>
            <h2 className="h2">DESSERT</h2>
            <img  className="img-type-dessert" src="/images/img-type-dessert.png" ></img>
          </button>
        </div>
        <div className="container-order-clear">
          <div className="f2">Order</div>
          <div className="f1" onClick={clear}>Clear all{" "}</div>
        </div>
      </div>
      <div className="grid-float">
        <div className="wrap-left">
          <P1FloatLeft productType={productType} addToCart={addToCart} />
        </div>
        <div className="wrap-right">
          <P1FloatRight cart={cart}  setCart={setCart}  addToCart={addToCart}productType={productType}/>
        </div>
      </div>
    </div>
  );
}

export default App;
