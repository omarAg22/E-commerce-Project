import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/loadingBox/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';
import { useNavigate } from 'react-router-dom';
import { Store } from '../../Store';
import { getError } from '../../utils';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistory = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`http://localhost:3001/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div style={{margin:'100px 0px'}}>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Row xs={1} md={2} lg={3}>
          {orders.map((order) => (
            <Col key={order._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title style={{ fontWeight: 'bold' }}>
                    {order._id}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Created at: {order.createdAt.substring(0, 10)}
                  </Card.Subtitle>
                  <Card.Text style={{ fontWeight: 'bold' }}>
                    Total: {order.totalPrice.toFixed(2)}
                  </Card.Text>
                  <Card.Text style={{ fontWeight: 'bold' }}>
                    Paid:{' '}
                    {order.isPaid ? (
                      <span>
                        {order.paidAt.substring(0, 10)}
                        <i
                          className="fas fa-check"
                          style={{ color: 'green', marginLeft: '5px' }}
                        ></i>
                      </span>
                    ) : (
                      <span>
                        <i
                          className="fas fa-times"
                          style={{ color: 'red', marginLeft: '5px' }}
                        ></i>
                      </span>
                    )}
                  </Card.Text>

                  <Card.Text style={{ fontWeight: 'bold' }}>
                    {/* Render Font Awesome icon based on the order status */}
                    Delivered:{' '}
                    {order.isDelivered ? (
                      <span>
                        {order.deliveredAt.substring(0, 10)}
                        <i
                          className="fas fa-check"
                          style={{ color: 'green', marginLeft: '5px' }}
                        ></i>
                      </span>
                    ) : (
                      <span>
                        <i
                          className="fas fa-times"
                          style={{ color: 'red', marginLeft: '5px' }}
                        ></i>
                      </span>
                    )}
                  </Card.Text>

                  <Button
                    type="button"
                    variant="light"
                    style={{ backgroundColor: '#3498db', fontWeight: 'bold' }}
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default OrderHistory;
