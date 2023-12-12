/* eslint-disable react/prop-types */
import { useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logos/crafted05.png";

const NavigationBar = ({ userInfo, signoutHandler, cart }) => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const handleMenuClick = () => {
    setMenuExpanded(!menuExpanded);
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="white"
        variant="dark"
        fixed="top"
        style={{ padding: "0 50px" }}
        className="text-dark" // Set text color to black
      >
        <Container>
          <Navbar.Brand>
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                style={{ width: "50px", height: "50px" }}
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={handleMenuClick}
            style={{ borderColor: "black" }} // Set border color to black
          >
            <i className="fas fa-bars" style={{ color: "black" }} />
          </Navbar.Toggle>
          <Navbar.Collapse in={menuExpanded}>
            <Nav className="me-auto text-dark">
              <Nav.Link as={Link} to="/" className="text-dark">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/shop" className="text-dark">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-dark">
                Contact
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/cart" className="nav-link text-dark">
                <i className="fas fa-shopping-bag" style={{ color: "black" }} />
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="red" className="ml-1">
                    <span className="text-dark">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <NavDropdown
                  title={<i className="fas fa-user" style={{ color: "black" }} />}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile" className="text-dark">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orderhistory" className="text-dark">
                    Order History
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={signoutHandler} className="text-dark">
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/signin" className="text-dark">
                  Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;
