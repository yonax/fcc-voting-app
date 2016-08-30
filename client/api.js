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