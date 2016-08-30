import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppRouter from './AppRouter';

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