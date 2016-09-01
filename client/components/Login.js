import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Form, FormGroup, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import { browserHistory, withRouter } from 'react-router';
import { Errors } from '.';
import { login } from '../api';
import auth from '../auth';

@withRouter
export default class Login extends Component {
  state = {
    errors: {},
  }
  tryLogin(event) {
    event.preventDefault();

    const username = findDOMNode(this.refs.username).value;
    const password = findDOMNode(this.refs.password).value;
    const errors = {};
    if (!username) {
      errors.username = 'username must not be empty';
    } 
    if (!password) {
      errors.password = 'password must not be empty';
    }
    this.setState({ errors });
    
    if (Object.keys(errors).some(x => x)) {
      return;
    }

    login(username, password).then(
      ({ username, token }) => {
        auth.login(username, token);
        const { router, location } = this.props;
        if (location.state && location.state.nextPathname) {
          router.replace(location.state.nextPathname);
        } else {
          router.replace('/');
        }
      },
      error => {
        errors.login = error.message;
        this.setState({ errors })
      } 
    );
  }
  render() {
    const { errors } = this.state;
    return (
    <Form onSubmit={::this.tryLogin}>
      <h3>Log in</h3>
      { Object.keys(errors).map(what =>
        <Errors key={what} error={{message: errors[what]}} /> 
      )}        
      <FormGroup>
        <FormControl ref="username" type="text" placeholder="username" />
      </FormGroup>
      <FormGroup>
        <FormControl ref="password" type="password" placeholder="password" />
      </FormGroup>
      <ButtonToolbar>
        <Button type="submit" bsStyle="primary">Login</Button>
        <Button onClick={() => browserHistory.goBack()}>Cancel</Button>
      </ButtonToolbar>
    </Form>
    );
  }
};