import auth from './auth';

export function fetchPolls() {
  return fetch('/api/polls').then(
    response => response.json()
  ); 
}

export function fetchPoll(id) {
  return fetch(`/api/polls/${id}`).then(
    response => response.json()
  )
}

export const voteFor = (pollId, payload) => 
  fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: new Headers({
      'Content-type': 'application/json',
      'Authorization': `JWT ${auth.getToken()}`
    }),
    body: JSON.stringify(payload)
  }).then(
    response => handleError(response)
  )

export const createPoll = (poll) => 
  fetch(`/api/polls/`, {
    method: 'POST',
    headers: new Headers({
      'Content-type': 'application/json',
      'Authorization': `JWT ${auth.getToken()}`
    }),
    body: JSON.stringify(poll)
  }).then(
    response => handleError(response)
  )

export const login = (username, password) => 
  fetch(`/api/auth/login`, {
    method: 'POST',
    headers: new Headers({
      'Content-type': 'application/json'
    }),
    body: JSON.stringify({
      username, password
    })
  }).then(
    response => handleError(response)
  )

function handleError(response) {
  if (response.ok) {
    return response.json();
  }
  return response.json().then(({ error }) => Promise.reject({ message: error }));
}