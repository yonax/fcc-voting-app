import React from 'react';
import { Alert } from 'react-bootstrap';

const Errors = ({ error }) => (
  error 
   ? <Alert bsStyle="danger">
        { error.message || 'Something went wrong'}
     </Alert>
   : null
);

export default Errors;