export function fetchPolls() {
  return Math.random() > 0.5 ? 
    fetch('/api/polls').then(response => response.json()) :
    Promise.reject() 
}
