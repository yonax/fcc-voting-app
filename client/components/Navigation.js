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
    { auth.isAuthenticated() ?
      <AuthenticatedUserMenu />:
      <UnauthenticatedUserMenu />
    }
  </Navbar>
);

const AuthenticatedUserMenu = (props) => (
  <Nav pullRight>
    <LinkContainer to="/my-polls">
      <NavItem>My polls</NavItem>
    </LinkContainer>
    <LinkContainer to="/logout">
      <NavItem>{ `Logout ${auth.getUsername()}` }</NavItem>
    </LinkContainer>
  </Nav>
);

const UnauthenticatedUserMenu = (props) => (
  <Nav pullRight>
    <LinkContainer to="/login">
      <NavItem>Log in</NavItem>
    </LinkContainer>
    <LinkContainer to="/signup">
      <NavItem>Sign up</NavItem>
    </LinkContainer>
  </Nav>
);

export default Navigation;