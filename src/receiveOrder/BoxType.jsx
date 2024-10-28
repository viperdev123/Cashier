import "./BoxType.css";
function BoxType(props) {
  const { tea, onAddToCart } = props;

  const handleAddToCart = (event) => {
    event.preventDefault();
    if (typeof onAddToCart === "function") {
      onAddToCart(tea); // ส่งข้อมูล tea ไปยังฟังก์ชัน addToCart
    } else {
      console.error("onAddToCart is not a function");
    }
  };
  return (
    <div className="box-type-item">
      <div className="wrap-img">
        <img src={tea.img}></img>
      </div>
      <div className="flex-type">
        <div className="wrap-product-name-price">
          <p className="f3">{tea.name}</p>
          <div className="wrap-price-currency">
            <div className="f5">{tea.plice}</div>
            <div className="f4">THB </div>
          </div>
        </div>
        <div className="container-button-plus">
          <button className="button-plus" onClick={handleAddToCart}>
            {tea.plus}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoxType;
