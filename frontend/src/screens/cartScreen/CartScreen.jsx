import { useContext } from 'react';
import { Store } from '../../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../../components/messageBox/MessageBox';

import './CartScreen.css';
import axios from 'axios';
const CartScreen = () => {

    const navigate = useNavigate()
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
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

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item,
    });
  };

  const checkOutHandler = () =>{
    navigate('/signin? redirect=/shipping')
  }
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="img-fluid rounded img-thumbnail"
                      />
                      <div className="product-name">
                        <Link to={`/product/${item.sku}`}>{item.product_name}</Link>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="quantity-controls">
                        <Button
                          onClick={() => updateCartHandler(item, item.quantity - 1)}
                          variant="light"
                          disabled={item.quantity === 1}
                          className="quantity-button"
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>
                        <span className="quantity">{item.quantity}</span>
                        <Button
                          onClick={() => updateCartHandler(item, item.quantity + 1)}
                          variant="light"
                          disabled={item.quantity === item.stock}
                          className="quantity-button"
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </div>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                        className="remove-button"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)})
                  </h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      onClick={checkOutHandler}
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                      className="checkout-button"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
