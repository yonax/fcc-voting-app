import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const Navigation = (props) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">FCC Vote app</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem eventKey={1} href="#">Link</NavItem>
    </Nav>
  </Navbar>
);

export default Navigation;