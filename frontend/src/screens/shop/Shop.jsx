import { useState, useEffect } from 'react';
import { Container, Col, Row, Card } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';
import ProductCards from './productCards/ProductCards';
import Search from './search/Search';
import ShopCategory from './categrorisShop/ShopCategory';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchData = async (category, page) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/products/get-all-product?page=${page}`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      // Filter products when the category changes
      filterItem(category, response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData(selectedCategory, currentPage);
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/categories/all-categories'
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handlePageChange = (value) => {
    setCurrentPage(value);
    // Fetch products for the selected category and page
    fetchData(selectedCategory, value);
  };

  const filterItem = (curCat, allProducts) => {
    if (curCat === 'All') {
      setFilteredProducts(allProducts);
    } else {
      const newItem = allProducts.filter((newVal) => {
        return newVal.category_name === curCat;
      });
      setSelectedCategory(curCat);
      setFilteredProducts(newItem);
    }
  };

  return (
    <Container style={{ margin: '100px 0px' }}>
      <Row style={{ width: '100%' }}>
        <Col xs={12} md={3}>
          <Card className="p-3 mb-3">
            <ShopCategory
              filterItem={filterItem}
              setProducts={setProducts}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              products={products}
            />
          </Card>
          <Card className="p-3">
            <Search products={products} />
          </Card>
        </Col>

        <Col xs={12} md={9}>
          <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <ProductCards
                products={
                  filteredProducts.length > 0 ? filteredProducts : products
                }
              />
            </div>
            <Pagination className="mt-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Shop;
