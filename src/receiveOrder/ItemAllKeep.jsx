import "./ItemAllKeep.css";

function ItemAllKeep(props) {
  const { tea, addToCart, removeFromCart } = props;

  return (
    <div className="itemallkeep">
      <div className="wrap-img-keep">
        <img src={tea.img}></img>
      </div>
      <div className="name-all-bill2">
        <div className="f2">{tea.name}</div>
        <div className="wrap-price-cur">
          <div className="f5">{tea.plice}</div>
          <div className="f4">THB</div>
        </div>
      </div>

      <div className="name-all-bill3">
        <img
          src="./images/minus.png"
          className="delete"
          onClick={() => removeFromCart(props.index)}
          alt="Remove"
        ></img>
        <div className="number">1</div>
        <img
          src="./images/plus.png"
          className="plus"
          onClick={() => addToCart(tea)}
          alt="Add"
        ></img>
      </div>
    </div>
  );
}

export default ItemAllKeep;
