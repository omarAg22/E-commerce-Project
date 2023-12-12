/* eslint-disable react/prop-types */
import { Button, Card } from 'react-bootstrap';

const ShopCategory = ({
  filterItem,
  categories,
  selectedCategory,
  products,
}) => {
  return (
    <Card className="p-3">
      <Card.Body>
        <Card.Title className="ms-2">All Categories</Card.Title>
        <Button
          onClick={() => filterItem('All', products)}
          className={`m-2 ${selectedCategory === 'All' ? 'btn-primary' : 'btn-light'}`}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            className={`m-2 ${selectedCategory === category.category_name ? 'btn-primary' : 'btn-light'}`}
            key={category._id}
            onClick={() => filterItem(category.category_name, products)}
          >
            {category.category_name}
          </Button>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ShopCategory;
