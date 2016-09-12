import React, { Component } from 'react';
import PollsList from './PollsList'; 
import { fetchPolls } from '../api';
import fetcher from '../fetcher';

const withPolls = fetcher(_ => fetchPolls('my'), 'polls');

export default withPolls(PollsList);

