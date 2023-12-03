/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './CheckoutSteps.css';

class CheckoutSteps extends Component {
  render() {
    const { step1, step2, step3, step4 } = this.props;

    return (
      <Row className="chekout-steps">
        <Col className={step1 ? 'active' : ''}>
          <i className="fas fa-sign-in-alt"></i>
          Sign-In
        </Col>
        <Col className={step2 ? 'active' : ''}>
          <i className="fas fa-shipping-fast"></i>
          Shipping
        </Col>
        <Col className={step3 ? 'active' : ''}>
          <i className="fas fa-credit-card"></i>
          Payment
        </Col>
        <Col className={step4 ? 'active' : ''}>
          <i className="fas fa-shopping-cart"></i>
          Place Order
        </Col>
      </Row>
    );
  }
}

export default CheckoutSteps;
