import { useEffect, useReducer, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // Import Bootstrap components
import { Store } from '../../Store';
import LoadingBox from '../../components/loadingBox/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';

import './TopArrivalProduct.css'; // Create a separate CSS file for custom styles

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const TopArrivalProduct = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          'http://localhost:3001/products/get-all-product'
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.products.slice(0, 5) });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:3001/products/get-product-byId/${item._id}`
    );
    if (data.stock < quantity) {
      window.alert('Sorry. Product is out of stock');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Container>
      <h2 className="mt-4">Top Arrival Products</h2>
      <Row xs={1} sm={2} md={3} lg={4} xl={4}>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          products.map((product) => (
            <Col key={product._id} className="mb-4">
              <Card className="product-card">
                <Link to={`/shop/${product._id}`}>
                  <Card.Img
                    variant="top"
                    src={product.product_image}
                    className="card-img-top"
                    alt={product.sku}
                  />
                </Link>
                <Card.Body>
                  <Link to={`/product/${product._id}`} className="product-link">
                    <Card.Title>{product.product_name}</Card.Title>
                  </Link>
                  <Card.Text className="product-price">${product.price}</Card.Text>
                  {product.stock === 0 ? (
                    <Button variant="secondary" disabled block>
                      Out of stock
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => addToCartHandler(product)}
                      className="add-to-cart-btn"
                      block
                    >
                      Add To Cart <i className="fas fa-shopping-bag" style={{ marginLeft:'5px'}}  />
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default TopArrivalProduct;
