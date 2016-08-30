import React, { Component } from 'react';
import { PollsList, Errors, Loading } from './components'; 
import { fetchPolls } from './api';

export default class App extends Component {
  state = {
    isFetching: true,
    polls: []
  }
  componentDidMount() {
    fetchPolls().then(
      polls => this.setState({ polls, isFetching: false }),
      error => this.setState({ error, isFetching: false }),
    )
  }
  render() {
    const { error, polls, isFetching } = this.state;
    return (
      <div>
        <Errors error={error} />
        { isFetching ? <Loading /> : <PollsList polls={polls} /> }
      </div>
    )
  }
}
