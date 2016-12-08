import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import MainComponent from './common/main.jsx';

import Redis from './redis.jsx';


ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={MainComponent}>
      <Route path="/:md5" component={Redis} />
    </Route>
  </Router>),
  document.querySelector('#wrapper')
);