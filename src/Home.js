import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Helper from './helpers.js';
import moment from 'moment';
import _ from 'lodash';


export class Home extends Component {
  constructor(props) {
    super(props);
    console.log('props in home', props.setTitle);
    console.log('constructor is called');
    this.setTitle = props.setTitle;
    this.state = {
      masterbudgets: [],
      personal: [],
      household: []
    }
  }

  componentDidMount() {
    this.fetchBudgets()
    this.setTitle('Home');
  }

  fetchBudgets() {
    Helper.authFetch('get', 'masterbudget_list').then(resp=> {
      const masterbudgets = _.groupBy(resp.results, item => item.expense_type);
      //const masterbudgets = resp.results;
      const personal = masterbudgets.Personal;
      const household = masterbudgets.Household;
      console.log('personal', personal);
      console.log('household', household);
      console.log('masterbudgets', masterbudgets);
      this.setState({masterbudgets: masterbudgets, personal: personal, household, household})
    })
  }

  render() {
    const {personal, household} = this.state;
    const masterbudgets =[];
    return (
        <div>
          <h3>Personal Budgets</h3>
          <hr/>
          {personal.length > 0 ?
              personal.map(mb => {return MasterBudget(mb)}) :
              <div>
                No personal budgets yet.
              </div>
          }
          <h3>Household Budgets</h3>
          <hr/>
          {household.length > 0 ?
              household.map(mb => {return MasterBudget(mb)}) :
              <div>
                No household budgets yet.
              </div>
          }
            <Link to="/create-budget">
              Create New Budget
            </Link>
        </div>
    )
  }
}

const MasterBudget = (mb)=>
    <div key={mb.id} className='budget-container'>
      <h3>
        {mb.name} ({mb.period})
      </h3>

      <p>
        {moment(mb.current_budget.start_time).format('D MMM')} to {moment(mb.current_budget.end_time).format('D MMM')}
      </p>
    <span className='remainder' style={{'font-size': '30px'}}>
      ${mb.current_budget.remainder} / {mb.amount}
    </span>
      <hr style={{width:'100%'}}/>
    </div>

export default Home
