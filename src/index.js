import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login'
import Base from './Base'
import './index.css';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import SignUp from './SignUp'
//import CreateBudget from './CreateBudget.js'
//import Summary from './Summary.js'
//import RecordsByBudget from './RecordsByBudget.js'


window.app = {}
//<Router history={browserHistory}>
//  <Route path="/" component={Base}>
//    <Route name='budgetWithRecords' path="/budgets/:id" component={RecordsByBudget}/>
//  </Route>

ReactDOM.render((
        <Router>
          <div>
            <Switch>
              <Route path="/login" component={Login}></Route>
              <Route path="/signup" component={SignUp}></Route>
              <Redirect exact path="/" to="/home"/>
              <Route path="/" component={Base}/>
            </Switch>
          </div>
        </Router>
    ), document.getElementById('root')
);



