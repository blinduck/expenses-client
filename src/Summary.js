import React, {Component} from 'react';
import Helper from './helpers.js'
import moment from 'moment'

export class Summary extends Component {
  constructor(props) {
    super(props)
    let currentDate = new Date()
    this.state = {
      selectedMonth: currentDate.getMonth() + 1,
      selectedExpenseType: "all"
    }
    this.setTitle = props.setTitle;
  }

  monthSelected = (event)=> {
    this.setState({
      selectedMonth: event.target.value
    }, this.fetchData)
    //console.log('month selected', event.target.value);
  }

  componentDidMount() {
    this.setTitle("Summary")
    this.fetchData();
  }
  expenseTypeChanged(event) {
    this.setState({
      selectedExpenseType: event.target.value
    }, this.fetchData)
  }
 

  fetchData() {
    Helper.authFetch('get', 'summary', null, {
      month: this.state.selectedMonth,
      type: this.state.selectedExpenseType,

    }).then(data => {
      this.setState(data)
    })
  }

  render() {
    return <div>
      <div>
        {MonthSelector(this.state.selectedMonth, this.monthSelected.bind(this))}
      </div>
      <select value={this.state.selectedExpenseType} onChange={this.expenseTypeChanged.bind(this)}>
        <option value="all">All</option>
        <option value="Personal">Personal</option>
        <option value="Household">Household</option>
      </select>
      {this.state.category_summary && this.state.category_summary.map(cat => {
        return <p key={cat[0]}>{cat[0]}: {cat[1]} </p>

      })}
    </div>
  }
}

const MonthSelector = (value, onChange)=> {
  return <select style={{display: 'block'}}
                 value={value}
                 onChange={onChange}>
    {moment.monthsShort().map((month, index) => {
      return <option key={month} value={index+1}>{month}</option>
    })}
  </select>
}

export default Summary
