
import './Rating.css';

const Rating = () => {
  return (
    <div className="rating">
      <div className="stars">
        <span>
          <i className='fas fa-star'></i>
        </span>
        <span>
          <i className='fas fa-star'></i>
        </span>
        <span>
          <i className='fas fa-star'></i>
        </span>
        <span>
          <i className='fas fa-star-half-alt'></i>
        </span>
        <span>
          <i className='fas fa-star-half-alt'></i>
        </span>
      </div>
      <span className="reviews">24 Reviews</span>
    </div>
  );
};

export default Rating;
