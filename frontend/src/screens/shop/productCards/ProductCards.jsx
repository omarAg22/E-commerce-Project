/* eslint-disable react/prop-types */
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCards = ({ products }) => {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {products.map((product, i) => (
        <Col key={i} className="mb-4">
          <Card className='cardd'>
            <Card.Img variant="top" src={product.product_image} alt={product.product_name} />
            <Card.Body>
              <Card.Title>
                <Link to={`/shop/${product._id}`} className="text-decoration-none">
                  {product.product_name}
                </Link>
              </Card.Title>
              <Card.Text>
                <p className="text-secondary">Category: {product.category_name}</p>
                <h5>${product.price}</h5>
              </Card.Text>
              <Button variant="primary">Add to Cart</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCards;
