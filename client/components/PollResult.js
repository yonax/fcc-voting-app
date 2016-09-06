import React, { Component } from 'react';
import { withRouter, browserHistory } from 'react-router';
import { Grid, Row, Col, ButtonToolbar, Button, ProgressBar } from 'react-bootstrap';
import fetcher from '../fetcher';
import { fetchPoll } from '../api';

function PollResult({ poll }) {
  const coef = 100 / poll.choices.reduce((acc, choice) => Math.max(acc, choice.votes), 0);

  return (
    <Grid>
    {poll.choices.map(choice => 
      <Row key={choice._id}>
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

const withPoll = fetcher(({ params: { pollId } }) => fetchPoll(pollId), 'poll');

export default withPoll(withRouter(PollResult));
