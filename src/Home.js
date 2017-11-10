import React, { Component } from 'react';
import Helper from './helpers.js';
import moment from 'moment';
import _ from 'lodash';
import {Link, withRouter} from 'react-router-dom'


class Home extends Component {
  constructor(props) {
    console.log('running', props);
    super(props);
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

  goToRecordsByBudget() {

  }

  fetchBudgets() {
    Helper.authFetch('get', 'masterbudget_list').then(resp=> {
      const masterbudgets = _.groupBy(resp.results, item => item.expense_type);
      // masterbudgets have a current_budget
      const personal = masterbudgets.Personal;
      const household = masterbudgets.Household;
      this.setState({masterbudgets: masterbudgets, personal: personal, household, household})
    })
  }

  render() {
    const {personal, household} = this.state;
    const masterbudgets = [];
    return (
        <div>
          <h3>Personal Budgets</h3>
          <hr/>
          {personal.length > 0 ?
              personal.map(mb => {
                return MasterBudget(mb, this.props.history)
              }) :
              <div>
                No personal budgets yet.
              </div>
          }
          <h3>Household Budgets</h3>
          <hr/>
          {household.length > 0 ?
              household.map(mb => {
                return MasterBudget(mb, this.props.history)
              }) :
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


const MasterBudget = (mb, history)=>
    <div key={mb.id} className='budget-container'>
      <h3>
        {mb.name} ({mb.period})
      </h3>
      <p>
        {moment(mb.current_budget.start_time).format('D MMM')} to {moment(mb.current_budget.end_time).format('D MMM')}
      </p>
      <span className='remainder' style={{'fontSize': '30px'}}>
        ${mb.current_budget.remainder} / {mb.amount}
      </span>
      <Link to={`budgets/${mb.id}`}>More</Link>
      <hr style={{width:'100%'}}/>
    </div>

export default withRouter(Home)
