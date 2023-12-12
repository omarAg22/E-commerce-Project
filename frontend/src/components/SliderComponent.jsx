import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import image1 from '../assets/images copy/pexels.jpeg';
import image2 from '../assets/images copy/pexels1.jpg';
import image3 from '../assets/images copy/pexels.jpeg';
import image4 from '../assets/images copy/pexels1.jpg';

const SliderComponent = () => {
  return (
    <div style={{marginTop:'50px', marginBottom:'300px'}}>
      <Carousel
        fade
        indicators={false}
        controls={false}
        interval={3000} // Set the autoplay speed in milliseconds
        style={{ maxHeight: '600px' }}
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image2}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image3}
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image4}
            alt="Fourth slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default SliderComponent;
