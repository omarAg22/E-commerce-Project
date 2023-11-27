/* eslint-disable react/prop-types */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
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
    <Card className="product-card">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.product_image}
          className="card-img-top"
          alt={product.sku}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`} className="product-link">
          <Card.Title className="product-title">
            {product.product_name}
          </Card.Title>
        </Link>
        <Rating />
        <Card.Text className="product-price">${product.price}</Card.Text>
        {product.stock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            className="add-to-cart-btn"
          >
            Add To Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
