import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

const root = document.getElementById('root');

render(
  <AppContainer>
    <App /> 
  </AppContainer>,
  root
);

if (module.hot) {
  module.hot.accept('./App', () => {
    render(
      <AppContainer>
        <App /> 
      </AppContainer>,
      root
    );
  })
}