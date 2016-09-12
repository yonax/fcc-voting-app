import React, { Component } from 'react';
import { withRouter } from 'react-router';
import update from 'react-addons-update';
import { 
  Form, Radio, ButtonToolbar, Button,
  FormGroup, InputGroup, FormControl
} from 'react-bootstrap';
import { browserHistory } from 'react-router'
import { fetchPoll, voteFor, remove } from '../api';
import { Errors } from '.';
import fetcher from '../fetcher';
import auth from '../auth';

class Poll extends Component {
  state = {
    poll: null,
    selectedChoice: null,
  }

  vote = () => {
    const { selectedChoice } = this.state;
    const { pollId } = this.props.params;

    voteFor(pollId, selectedChoice).then(
      response => browserHistory.push(`/polls/${pollId}/result`),
      error => this.setState({ error })  
    );
  }

  selectChoice = (choice) => {
    this.setState({ selectedChoice: choice  });
  }

  handleChangeCustom(text) {
    this.setState(update(this.state, { 
      selectedChoice: {
        text: {
          $set: text
        }
      }
    }));
  }

  remove() {
    if (confirm("Are you sure?")) {
      remove(this.props.poll._id).then(
        () => browserHistory.replace('/')
      );
    }
  }

  isValid() {
    const { selectedChoice } = this.state;
    
    return selectedChoice && selectedChoice.text; 
  }
  
  render() {
    const { poll } = this.props;
    const { error, selectedChoice } = this.state;
    if (error) {
      return <Errors error={error} />
    }

    return (
      <div>
        <h4>{ poll.topic }</h4>
        <Form>
          {poll.choices.map(choice =>
            <Choice 
              key={choice._id} 
              choice={choice}
              selected={selectedChoice === choice}
              select={this.selectChoice} />
          )}
          { auth.isAuthenticated() && 
            <CustomChoice selected={selectedChoice && selectedChoice.custom}
                          value={selectedChoice && selectedChoice.custom && selectedChoice.text} 
                          change={::this.handleChangeCustom}
                          select={this.selectChoice} /> 
          } 

          <Controls poll={poll} vote={this.vote} voteDisabled={!this.isValid()}
                    goBack={browserHistory.goBack}
                    goResult={() => browserHistory.push(`/polls/${poll._id}/result`)}
                    remove={::this.remove} />
        </Form>
      </div>
    )
  }
}

function CustomChoice({ selected, value, change, select }) {
  return (
    <FormGroup>
      <InputGroup>
        <InputGroup.Addon>
          <input type="radio" name="choice" onClick={() => select({ text: '', custom: true})}/>
        </InputGroup.Addon>
        <FormControl 
          type="text" 
          placeholder="custom choice"
          disabled={!selected}
          value={value}
          onChange={(e) => change(e.target.value)}
        />
      </InputGroup>
    </FormGroup>
  );
}

function Choice({ choice, selected, select }) {
  return (
    <Radio name="choice" value={choice._id} 
           onClick={() => select(choice)}
           checked={selected}
           style={{ padding: "6px 12px "}}>
      { choice.text }
    </Radio>
  );
}

function Controls({ poll, vote, voteDisabled, goBack, goResult, remove }) {
  const link = encodeURIComponent(window.location);
  const text = encodeURIComponent(poll.topic);
  const href = `https://twitter.com/intent/tweet?url=${link}&text=${text}`;

  return (
    <ButtonToolbar>
      <Button bsStyle="success" disabled={voteDisabled} onClick={vote}>Vote</Button>
      <Button onClick={goBack}>Back</Button>
      <Button onClick={goResult}>See result</Button>
      <Button href={href}>
        <span className="fa fa-twitter" />&nbsp;Share on Twitter
      </Button>
      { poll.canDelete &&
        <Button bsStyle="danger" onClick={remove}>
          <span className="glyphicon glyphicon-trash" />&nbsp;Delete
        </Button>
      }
    </ButtonToolbar>
  );
}

const withPoll = fetcher(({ params: { pollId } }) => fetchPoll(pollId), 'poll');

export default withPoll(withRouter(Poll));