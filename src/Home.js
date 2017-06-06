import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Helper from './helpers.js';
import moment from 'moment';


export class Home extends Component {
  constructor(props) {
    super(props);
    console.log('props in home', props.setTitle);
    console.log('constructor is called');
    this.setTitle = props.setTitle;
    this.state = {
      masterbudgets: []
    }
  }

  componentDidMount() {
    this.fetchBudgets()
    this.setTitle('Home');
  }

  fetchBudgets() {
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
          <h3>Budgets</h3>
          <hr/>
          {masterbudgets.length > 0 ?
              masterbudgets.map(mb => {return MasterBudget(mb)}) :
              <div>
                No budgets yet.
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
