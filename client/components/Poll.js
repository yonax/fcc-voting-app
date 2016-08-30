import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Form, Radio, ButtonToolbar, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router'
import { fetchPoll, voteFor } from '../api';
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
  vote = () => {
    const { checked } = this.state;
    const { pollId } = this.props.params;
    voteFor(pollId, checked).then(
      response => browserHistory.push(`/polls/${pollId}/result`),
      error => this.setState({ error })  
    );
  }
  handleChangeChoice = (id) => {
    this.setState({ checked: id, error: null });
  } 
  render() {
    const { isFetching, poll, error, checked } = this.state;
    if (error) {
      return <Errors error={error} />
    }
    if (isFetching) {
      return <Loading />
    }
    return (
      <div>
        <h4>{ poll.topic }</h4>
        <Form>
          {poll.choices.map(choice =>
            <Choice 
              key={choice._id} 
              id={choice._id} 
              label={choice.text} 
              onChange={this.handleChangeChoice} />
          )}
          <Controls vote={this.vote} voteDisabled={!checked}
                    goBack={browserHistory.goBack}
                    goResult={() => browserHistory.push(`/polls/${poll._id}/result`)} />
        </Form>
      </div>
    )
  }
}

function Choice({ id, label, onChange }) {
  return (
    <Radio name="choice" value={id} onClick={() => onChange(id)}>
      { label }
    </Radio>
  );
}

function Controls({ vote, voteDisabled, goBack, goResult }) {
  return (
    <ButtonToolbar>
      <Button bsStyle="success" disabled={voteDisabled} onClick={vote}>Vote</Button>
      <Button onClick={goBack}>Back</Button>
      <Button onClick={goResult}>See result</Button>
    </ButtonToolbar>
  );
}