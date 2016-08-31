import React from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import Layout from './Layout';
import { AllPolls, Poll, PollResult, CreatePoll } from './components';

export default function() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={AllPolls} />
        <Route path="polls/:pollId" component={Poll} />
        <Route path="polls/:pollId/result" component={PollResult} />
        <Route path="create-poll" component={CreatePoll} />
      </Route>
    </Router>
  );
}
