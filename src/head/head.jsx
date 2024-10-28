import React from "react";
import { Link, BrowserRouter } from "react-router-dom";
import Back from "../assets/Back.png";
import "./head.css";
import cir1 from "../assets/cir.png";
import cir2 from "../assets/cir2.png";
import cir3 from "../assets/cir3.png";
import Time from "../assets/Time.png";
import tea from "../assets/tea.png";
import sodacan from "../assets/sodacan.png";
import dessert from "../assets/dessert.png";

function headder() {
  return (
    <div className="container-headder">
      <div className="container-bg">
        <img className="cir1" src={cir1} alt="" />
        <img className="cir2" src={cir2} alt="" />
        <img className="cir3" src={cir3} alt="" />
        <div className="container-btn">
          <div className="btn-back">
            <Link to="/" className="back">
              <img className="backarrow" src={Back} alt="" />
              <p className="text-back">back</p>
            </Link>
          </div>
        </div>
        <div className="history">
          <h1 className="history-h1">History Bills</h1>
          <img className="time" src={Time} alt="" />
        </div>
        <div className="container-menubtn">
          <div className="btn-menu" style={{ background: "#FFEF92" }}>
            <Link to="/tea" className="link-menu">
              <p className="text-menu">TEA</p>
              <img className="menu-img" src={tea} alt="" />
            </Link>
          </div>
          <div className="btn-menu" style={{ background: "#b6d7cf" }}>
            <Link to="/soda" className="link-menu" >
              <p className="text-menu">DRINK</p>
              <img className="menu-img" src={sodacan} alt="" />
            </Link>
          </div>
          <div className="btn-menu" style={{ background: "#f5cac3" }}>
            <Link to="" className="link-menu">
              <p className="text-menu">DESSERT</p>
              <img className="menu-img" src={dessert} alt="" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default headder;
