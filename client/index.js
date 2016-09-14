import React from 'react';
import { render } from 'react-dom';
import AppRouter from './AppRouter';

if (module.hot) {
  const AppContainer = require('react-hot-loader');
}

const root = document.getElementById('root');

render(
  <AppRouter />
  ,root
);

if (module.hot) {
  module.hot.accept('./AppRouter', () => {
    render(
      <AppContainer>
        <AppRouter /> 
      </AppContainer>,
      root
    );
  })
}