/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './CheckoutSteps.css'
const CheckoutSteps = (props) => {
  return (
    <Row className="chekout-steps">
        <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
        <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
        <Col className={props.step3 ? 'active' : ''}>Payment</Col>
        <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  )
}

export default CheckoutSteps