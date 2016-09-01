import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import auth from '../auth';

const Navigation = (props) => (
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">FCC Vote app</Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to="/create-poll">
        <NavItem>Create poll</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
        { auth.isAuthenticated() ?
          <LinkContainer to="/logout">
            <NavItem>Logout</NavItem>
          </LinkContainer>
          :
          <LinkContainer to="/login">
            <NavItem>Login</NavItem>
          </LinkContainer>
        }
    </Nav>
  </Navbar>
);

export default Navigation;