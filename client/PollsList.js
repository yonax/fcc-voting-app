import React from 'react';

const PollsList = ({ polls }) => (
  <ul>
    { polls.map(poll => 
      <li key={poll._id}>
        <h4>{poll.topic}</h4>
        <span>Votes: {poll.choices.reduce((acc, choice) => acc + choice.votes, 0)}</span>
      </li>
    )}
  </ul>
)

export default PollsList;