import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Head from "./head/head.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderSoda from "./Order/OrderSoda.jsx";
import Sum from "./Summary/sum.jsx";
import Tea from "./Tea/Tea.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./receiveOrder/App.jsx";
import Dessert from "./Dessert/Dessert.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/soda"
        element={
          <>
            <Head />
            <OrderSoda />
            <Sum />
          </>
        }
      />
      <Route path="/tea" element={
          <>
            <Head />
            <Tea />
            <Sum />
          </>
        } />
      <Route path="/dessert" element={
          <>
            <Head />
            <Dessert />
            <Sum />
          </>
        } />
    </Routes>
    
  </BrowserRouter>
);
