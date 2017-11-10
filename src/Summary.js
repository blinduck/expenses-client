import React, {Component} from 'react';
import Helper from './helpers.js'
import moment from 'moment'

class Summary extends Component {
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
    const {type_summary, category_summary } = this.state;
    return <div>
      <div>
        {MonthSelector(this.state.selectedMonth, this.monthSelected.bind(this))}
      </div>
      <select value={this.state.selectedExpenseType} onChange={this.expenseTypeChanged.bind(this)}>
        <option value="all">All</option>
        <option value="Personal">Personal</option>
        <option value="Household">Household</option>
      </select>
      {category_summary && category_summary.map(cat => {
        return <p key={cat[0]}>{cat[0]}: {cat[1]} </p>
      })}
      <hr/>
      {type_summary ?
          <div>
            <h2>Personal: {type_summary.Personal}</h2>
            <h2>Household</h2>
            {type_summary.Household.map(d => {
              return <p>{d.user__username}: {d.total} </p>
            })}
          </div>
          : null}

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
