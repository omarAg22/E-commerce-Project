// ProductScreen.jsx

import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Rating from '../../components/rating/Rating';
import './ProductScreen.css'; // Import the CSS file for styling
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/loadingBox/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';
import { getError } from '../../utils';
import { Store } from '../../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const navigate = useNavigate()
  const { id } = useParams();

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:3001/products/get-product-byId/${id}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:3001/products/get-product-byId/${product._id}`
    );

    if (data.stock < quantity) {
      window.alert('Sorry . Product in out of stock');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity},
    });
    navigate('/cart')
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="d-flex justify-content-center align-items-center">
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.product_image}
            alt={product.product_name}
          />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.product_name}</title>
              </Helmet>
              <h1 className="product-name">{product.product_name}</h1>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating />
            </ListGroup.Item>

            <ListGroup.Item className="price">
              Price: ${product.price}
            </ListGroup.Item>
            <ListGroup.Item className="description">
              Description: {product.short_description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price: </Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      {product.stock > 0 ? (
                        <Badge className="status-badge" bg="success">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge className="status-badge" bg="danger">
                          Unavailable
                        </Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.stock > 0 && (
                  <ListGroup.Item>
                    <Button onClick={addToCartHandler} className="primary-btn">
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
