import React from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import Layout from './Layout';
import { AllPolls, Poll } from './components';

export default function() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={AllPolls} />
        <Route path="polls/:pollId" component={Poll} />
      </Route>
    </Router>
  );
}
