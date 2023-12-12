import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Categories.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        categories: action.payload.categories,
        totalPages: action.payload.totalPages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Categories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [{ loading, error, categories, totalPages }, dispatch] = useReducer(reducer, {
    categories: [],
    loading: true,
    error: '',
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`http://localhost:3001/categories/all-categories?page=${currentPage}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  return (
    <div style={{margin:"100px 0px"}}>
      <h2>Categories</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          categories.map((category) => (
            <Col key={category._id}>
              <Card className="category-card">
                <div className="image-container">
                  <Card.Img
                    src={category.categorie_image}
                    alt={category.category_name}
                    className="category-image"
                  />
                  <div className="category-name">
                    {category.category_name}
                  </div>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {totalPages > 1 && (
        <div className="pagination">
          <Pagination>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item 
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Categories;
