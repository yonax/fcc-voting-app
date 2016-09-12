export default {
  isAuthenticated() {
    return !!localStorage.token && !!localStorage.username;
  },
  
  getToken() {
    return localStorage.token;
  },

  getUsername() {
    return localStorage.username;
  },

  login(username, token) {
    localStorage.username = username;
    localStorage.token  = token;
  },

  logout() {
    localStorage.clear();
  }
};