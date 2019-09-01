import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/login';
import Join from './components/join';
import Catering from './components/catering';
import Client from './components/client';
import * as serviceWorker from './serviceWorker';
import { Router, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
  <Router history={history}>
    <Route path="/" exact component={App} />
    <Route path="/login" component={Login} />
    <Route path="/join" component={Join} />
    <Route path="/catering" component={Catering} />
    <Route path="/client" component={Client} />
  </Router>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
