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
import moment from 'moment'
import {SignUp} from './SignUp'
import CreateBudget from './CreateBudget.js'
import Category from './Category.js'
import Summary from './Summary.js'

console.log('env', process.env.NODE_ENV); 

window.moment = moment;

window.app = {}

ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/" component={Base}>
        <Route path="/home" component={Home}/>
        <Route path="/create" component={Create}/>
        <Route path="/expense-list" component={RecordList}/>
        <Route path="/create-budget" component={CreateBudget}/>
        <Route path="/categories" component={Category}/>
        <Route path="/summary" component={Summary}/>
      </Route>

    </Router>
  ), document.getElementById('root')
);



