import React from 'react';
import { Alert } from 'react-bootstrap';

const Errors = ({ error }) => (
  error 
   ? <Alert bsStyle="danger">
      <h4>{ error.message || 'Something went wrong'}</h4>
     </Alert>
   : null
);

export default Errors;