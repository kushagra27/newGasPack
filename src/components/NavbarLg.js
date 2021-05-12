import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
const NavbarLg = () => {
  return (
    <Navbar expand="lg" id="lgNav" >
      <Navbar.Brand href="#" id="brand">Gas Agency</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll"/>
      <Navbar.Collapse id="navbarScroll">
        <Nav
          style={{ maxHeight: "100vh" }}
          navbarScroll
        >
          <Nav.Item>
            <Link to="/newParty">New Party</Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
            <Link to="/newDispatch">New Dispatch</Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
            <Link to="/newReceive">New Receive</Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withRouter(NavbarLg);