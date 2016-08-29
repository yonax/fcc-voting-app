import React, { Component } from 'react';
import PollsList from './PollsList'; 
import { fetchPolls } from './api';

export default class App extends Component {
  state = {
    isFetching: true,
    polls: []
  }
  componentDidMount() {
    fetchPolls().then(
      polls => this.setState({ polls, isFetching: false }),
      error => this.setState({ 
        error: error && error.message || 'Something went wrong', 
        isFetching: true 
      }),
    )
  }
  render() {
    if (this.state.error) {
      return <h2>Error: {this.state.error}</h2>
    }
    return (
      <div>
        <PollsList polls={this.state.polls} />
      </div>
    )
  }
}
