import React from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import Layout from './Layout';
import { AllPolls, Poll, PollResult, CreatePoll, Login } from './components';
import auth from './auth';

function requireAuth(nextState, replace) {
  if (!auth.isAuthenticated()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

function logout(nextState, replace) {
  auth.logout();
  replace({
    pathname: '/'
  });
}

export default function() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={AllPolls} />
        <Route path="polls/:pollId" component={Poll} />
        <Route path="polls/:pollId/result" component={PollResult} />
        <Route path="create-poll" component={CreatePoll} onEnter={requireAuth} />
        <Route path="login" component={Login} />
        <Route path="logout" onEnter={logout} />
      </Route>
    </Router>
  );
}
