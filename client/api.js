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

export const voteFor = (pollId, choiceId) => 
  fetch(`/api/polls/${pollId}/vote`, {
    method: 'POST',
    headers: new Headers({
      'Content-type': 'application/json'
    }),
    body: JSON.stringify({
      choiceId
    })
  }).then(
    response => handleError(response)
  )

export const createPoll = (poll) => 
  fetch(`/api/polls/`, {
    method: 'POST',
    headers: new Headers({
      'Content-type': 'application/json'
    }),
    body: JSON.stringify(poll)
  }).then(
    response => handleError(response)
  )

function handleError(response) {
  if (response.ok) {
    return response.json();
  }
  return response.json().then(({ error }) => Promise.reject({ message: error }));
}