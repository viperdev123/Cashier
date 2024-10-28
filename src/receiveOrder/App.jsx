import { useState } from "react";
import "./App.css";
import P1FloatLeft from "./P1FloatLeft";
import P1FloatRight from "./P1FloatRight";
import { teas, drinks } from "./data/product";
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
    <div>
      <header className="p1-header">
        <img className="cir1" src={cir1} alt="" />
        <img className="cir2" src={cir2} alt="" />
        <img className="cir3" src={cir3} alt="" />
        <Link to="/soda" className="change-HistoryBill">
          <h1 className="h1">History Bills</h1>
          <img
            className="img-header-history"
            src="/images/img-header-history.png"
          />
        </Link>
        <div className="grid-type">
          <button
            className="type-tea"
            onClick={() => handleTypeOfProduct(teas)}
          >
            <h2 className="h2">TEA</h2>
            <img className="img-type-tea" src="/images/img-type-tea.png"></img>
          </button>

          <button
            className="type-drink"
            onClick={() => handleTypeOfProduct(drinks)}
          >
            <h2 className="h2">DRINK</h2>
            <img
              className="img-type-drink"
              src="/images/img-type-drink.png"
            ></img>
          </button>
          <button
            className="type-dessert"
            onClick={() => handleTypeOfProduct()}
          >
            <h2 className="h2">DESSERT</h2>
            <img
              className="img-type-dessert"
              src="/images/img-type-dessert.png"
            ></img>
          </button>
        </div>
        <div className="f2">Order</div>
        <div className="f1" onClick={clear}>
          Clear all{" "}
        </div>
      </header>
      <div className="grid-float">
        <P1FloatLeft productType={productType} addToCart={addToCart} />
        <P1FloatRight cart={cart} setCart={setCart} addToCart={addToCart} />
      </div>
    </div>
  );
}

export default App;
