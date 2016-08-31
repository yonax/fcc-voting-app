import React from 'react';
import { Navigation } from './components';
import { Grid } from 'react-bootstrap';  

export default function Layout({ children }) {
  return (
    <div>
      <Navigation />
      <Grid style={{minWidth: 500}}>
        { React.Children.only(children) }
      </Grid>
    </div>
  )
}