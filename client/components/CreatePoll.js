import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { 
  Form, FormGroup, FormControl, InputGroup, Button,
  ButtonToolbar 
} from 'react-bootstrap';
import update from 'react-addons-update';
import { Errors } from '.';
import { createPoll } from '../api';

let uniqId = 0;
function emptyChoice() {
  return {id: uniqId++, text: ''};
}

export default class CreatePoll extends Component {
  state = {
    topic: '',
    choices: [emptyChoice(), emptyChoice(), emptyChoice()],
    errors: null
  }
  handleTopicChange(event) {
    this.setState({ topic: event.target.value });
  }
  choiceChange(index, event) {
    this.setState(update(this.state, {
      choices: {
        [index] : {
          $merge: { text: event.target.value }
        }
      }
    }));
  }
  removeChoice(index) {
    this.setState(update(this.state, {
      choices: {
        $splice: [[index, 1]]
      }
    }));
  }
  addEmptyChoice() {
    this.setState(update(this.state, {
      choices: {
        $push: [emptyChoice()]
      }
    }));
  }
  getErrors() {
    const { choices } = this.state;
    const topic = this.state.topic.trim();

    const topicEmpty = topic.length === 0;
    const filledChoices = choices.filter(choice => !!choice.text);

    const errors = [];
    if (topicEmpty) {
      errors.push({ field: 'topic', message: 'Poll topic must not be empty' });
    }
    if (filledChoices.length < 2) {
      errors.push({ field: 'choices', message: 'Should be at least two options for voting' });
    }
    return errors.length === 0 ? null : errors; 
  }
  createPoll() {
    const errors = this.getErrors();
    if (errors) {
      this.setState({ errors });
    } else {
      this.setState({ errors: null });
      const { topic, choices } = this.state;
      const nonEmptyChoices = choices.filter(c => !!c.text);

      createPoll({ topic, choices: nonEmptyChoices })
      .then(
        poll  => browserHistory.push(`/polls/${poll._id}`),
        error => this.setState({ errors: [error]})
      );
    }
  }
  goBack() {
    browserHistory.goBack();
  }
  render() {
    const { topic, choices, errors } = this.state;

    return (
      <Form>
        <FormGroup>
          { errors && errors.map(error =>
            <Errors key={error.field} error={error} /> 
          )}
        </FormGroup>
        <FormGroup>
          <FormControl type="text" placeholder="Enter poll topic"
                       value={topic} onChange={::this.handleTopicChange} />
        </FormGroup>
        <ChoicesList choices={choices} 
                     onChange={::this.choiceChange}
                     remove={::this.removeChoice} 
        />
        <Controls createPoll={::this.createPoll}
                  addEmpty={::this.addEmptyChoice}
                  goBack={::this.goBack}
        />
      </Form>
    )
  }
}

const Controls = ({ createPoll, goBack, addEmpty }) => (
  <ButtonToolbar>
    <Button bsStyle="primary" onClick={createPoll}>
      <span className="glyphicon glyphicon-ok" />
      &nbsp;Create
    </Button>
    <Button onClick={goBack}>
      <span className="glyphicon glyphicon-remove" />
      &nbsp;Cancel and go back
    </Button>
    <Button onClick={addEmpty} className="pull-right">
      <span className="glyphicon glyphicon-plus" />
      &nbsp;Add another choice
    </Button>
  </ButtonToolbar>
);

const ChoicesList = ({ choices, onChange, remove }) => (
  <div>
  {choices.map(({id, text}, index) =>
    <Choice key={id} value={text} 
            onChange={onChange.bind(null, index)}
            remove={remove.bind(null, index)} /> 
  )}
  </div>
); 

const Choice = ({ value, onChange, remove }) => (
  <FormGroup>
    <InputGroup>
      <InputGroup.Addon>
        <span className="glyphicon glyphicon-asterisk" />
      </InputGroup.Addon>
      <FormControl type="text" placeholder="choice" 
                   value={value} onChange={onChange} />
      <InputGroup.Button>
        <Button bsStyle="danger" onClick={remove}>
          <span className="glyphicon glyphicon-trash" />
          &nbsp;Remove
        </Button>
      </InputGroup.Button>
    </InputGroup>
  </FormGroup>
);
