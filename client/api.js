export function fetchPolls() {
  return fetch('/api/polls').then(response => {
    if (Math.random() > 0.5) {
      throw new Error('SNAFU');
    }
    return response.json();
  }); 
}
