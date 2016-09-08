import React from 'react';
import { Link } from 'react-router';

const PollsList = ({ polls }) => (
  <div className="poll-list">
    { polls.map(poll => 
      <div key={poll._id} className="poll well">
        <Link to={`/polls/${poll._id}`}>
          <h4>{poll.topic}</h4>
        </Link>
        <span>Votes: {poll.choices.reduce((acc, choice) => acc + choice.votes, 0)}</span>
      </div>
    )}
  </div>
)

export default PollsList;