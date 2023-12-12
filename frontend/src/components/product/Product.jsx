/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import './Product.css';
import Rating from '../rating/Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../../Store';

const Product = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:3001/products/get-product-byId/${item._id}`
    );
    if (data.stock < quantity) {
      window.alert('Sorry . Product in out of stock');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <div className="products-card">

      <div className='image'>
      <Link to={`/product/${product._id}`}>
        <img
          src={product.product_image}
          className="card-img-top"
          alt={product.sku}
        />
      </Link>
      </div>
      <div className='details'>
        <Link to={`/product/${product._id}`} className="product-link">
          <p className="product-title">
            {product.product_name}
          </p>
        </Link>
        <Rating />
        <h4 className="product-price">${product.price}</h4>
        {product.stock === 0 ? (
          <button disabled>
            Out of stock
          </button>
        ) : (
          <button
            onClick={() => addToCartHandler(product)}
            className="add-to-cart-btn"
          >
            Add To Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
