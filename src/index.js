import React from 'react';
import ReactDOM from 'react-dom';
//import {App, Test} from './App';
import Login from './Login'
import {Home} from './Home'
import {Base} from './Base'
import {RecordList} from './RecordList'
import {Create} from './Create'
import './index.css';
import { Router, Route, browserHistory } from 'react-router'

window.app = {
  baseUrl:'http://expenses.dev/api/v1'
}


ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/login" component={Login}/>
      <Route path="/" component={Base}>
        <Route path="/home" component={Home}/>
        <Route path="/create" component={Create}/>
        <Route path="/expense-list" component={RecordList}/>
      </Route>

    </Router>
  ), document.getElementById('root')
);
