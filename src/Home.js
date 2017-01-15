import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'
import Helper from './helpers.js'
import moment from 'moment'



export class Home  extends Component{
  constructor(props){
    super(props);
    console.log('constructor is called');
    this.state = {
      masterbudgets: null
    }
  }

  componentDidMount(){
    this.fetchBudgets()
  }

  fetchBudgets(){
    Helper.authFetch('get', 'masterbudget_list').then(resp=> {
      const masterbudgets = resp.results;
      console.log('masterbudgets', masterbudgets);
      this.setState({masterbudgets: masterbudgets})
    })
  }

  render() {
    const {masterbudgets} = this.state;
    return (
      <div>
        <h1>Budgets</h1>
        <hr/>
        {masterbudgets && masterbudgets.map((mb)=> {
          return MasterBudget(mb)
        })}
      </div>
    )
  }
}

const MasterBudget = (mb)=>
  <div>
    <p>{mb.name} ({mb.period})</p>
    <p>
      {moment(mb.current_budget.start_time).format('D MMM')} to {moment(mb.current_budget.end_time).format('D MMM')}
    </p>
    <p>Remainder: {mb.current_budget.remainder} of {mb.amount}</p>
    <hr/>
  </div>

export default Home
