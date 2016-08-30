import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { fetchPoll } from '../api';
import { Loading, Errors } from '.';

@withRouter
export default class Poll extends Component {
  state = {
    isFetching: true,
    poll: null
  }
  componentDidMount() {
    const { params: { pollId } } = this.props; 
    fetchPoll(pollId).then(
      poll  => this.setState({ poll, isFetching: false }),
      error => this.setState({ error, isFetching: false })
    )
  }
  render() {
    const { isFetching, poll, error } = this.state;
    if (error) {
      return <Errors error={error} />
    }
    if (isFetching) {
      return <Loading />
    }
    return (
      <div>
        <h4>{ poll.topic }</h4>
        <ul>
        {poll.choices.map(choice =>
          <li key={choice._id}>{ choice.text }</li> 
        )}
        </ul>
      </div>
    )
  }
}
