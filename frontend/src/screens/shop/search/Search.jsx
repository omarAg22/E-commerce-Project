/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Card, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Search = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterProducts = products.filter((product) =>
    product.product_name && product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-3 mt-3">
      <Form>
        <FormControl
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <div>
        {searchTerm &&
          filterProducts.map((product) => (
            <Link key={product._id} to={`/shop/${product._id}`} className="text-decoration-none">
              <div className="d-flex gap-3 p-2">
                <div>
                  <div className="pro-thumb h-25">
                    <img
                      src={product.product_image} // Replace with your actual image URL
                      alt=""
                      width={70}
                      className="flex-grow-0"
                    />
                  </div>
                </div>
                <div className='product-content'>
                  <p>
                    <Link to={`/shop/${product._id}`}>{product.product_name}</Link>
                  </p>
                  <h6>${product.price}</h6>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </Card>
  );
};

export default Search;
