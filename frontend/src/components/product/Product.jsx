/* eslint-disable react/prop-types */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './Product.css';
import Rating from '../rating/Rating';

const Product = (props) => {
  const { product } = props;

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
        <Button className="add-to-cart-btn">Add To Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
