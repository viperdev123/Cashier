import { useState } from "react";
import BoxType from "./BoxType";
import "./P1FloatLeft.css";

function P1FloatLeft({ productType, addToCart }) {
  return (
    <div className="float-left-box">
      <div className="grid-left-box">
        {productType.map((element, index) => (
          <BoxType key={index} tea={element} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default P1FloatLeft;
