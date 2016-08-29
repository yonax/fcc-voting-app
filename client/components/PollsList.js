import React from 'react';

const PollsList = ({ polls }) => (
  <div className="poll-list">
    { polls.map(poll => 
      <li key={poll._id} className="poll well">
        <h4>{poll.topic}</h4>
        <span>Votes: {poll.choices.reduce((acc, choice) => acc + choice.votes, 0)}</span>
      </li>
    )}
  </div>
)

export default PollsList;