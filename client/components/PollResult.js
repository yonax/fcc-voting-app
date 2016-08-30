import React, { Component } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { Grid, Row, Col, ButtonToolbar, Button, ProgressBar } from 'react-bootstrap';
import { Loading, Errors } from '.';
import { fetchPoll } from '../api';

@withRouter
export default class PollResult extends Component {
  state = {
    isFetching: true,
    poll: null,
    error: null
  }
  componentDidMount() {
    const { pollId } = this.props.params;
    fetchPoll(pollId).then(
      poll  => this.setState({ poll, isFetching: false }),
      error => this.setState({ error, isFetching: false }) 
    );
  }
  render() {
    const { isFetching, error, poll } = this.state;
    if (error) {
      return <Errors error={error} />
    }
    if (isFetching) {
      return <Loading />
    }

    const coef = 100 / poll.choices.reduce((acc, choice) => Math.max(acc, choice.votes), 0);

    return (
      <Grid>
      {poll.choices.map(choice => 
        <Row>
          <Col xs={2}>{ choice.text}</Col>
          <Col xs={10}>
            <ProgressBar style={{minWidth: '2%'}} 
                      now={ coef * choice.votes } 
                      label={ choice.votes } />
          </Col>
        </Row>
      )}
      </Grid>
    );
  }
}