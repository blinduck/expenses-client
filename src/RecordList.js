import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'
import Helper from './helpers.js'
import moment from 'moment'

// when starting => assume start in month mode
// get current month and year => set it as part of the state
// set a startDate and endDate => which is basically the start and
// end of the month
// when querying => filter based on the given start and end date =>
// for selector => when selected => set new start and end dates
// fetch page 1

// todo implement a year selector

export class RecordList extends Component {
  constructor(props) {
    super(props);
    this.setTitle = props.setTitle;
    const m = moment.utc();
    const expenseTypeSelectorOptions = ['All', 'Personal', 'Household'];

    this.state = {
      records: [],
      loading: true,
      next: null,
      m: m,
      // startDate and endDate are unix timestamps
      // number of seconds from 1970
      startDate: m.clone().startOf('month').unix(),
      endDate: m.clone().endOf('month').unix(),
      selectedMonth: m.clone().toDate().getMonth(),
      expenseTypeSelectorOptions: expenseTypeSelectorOptions,
      expenseType: expenseTypeSelectorOptions[0]
    };
    console.log('month', m, this.state.selectedMonth);
    this.monthSelected = this.monthSelected.bind(this);
    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.expenseTypeSelectorChanged = this.expenseTypeSelectorChanged.bind(this);
  }

  componentDidMount() {
    this.setTitle('Expenses');
    this.fetchExpenses(1, true)
  }


  monthSelected(event) {
    const {m} = this.state;
    const value = event.target.value;
    this.setState({
      selectedMonth: value,
      startDate: m.clone().month(value).startOf('month').unix(),
      endDate: m.clone().month(value).endOf('month').unix()
    }, this.fetchExpenses.bind(this, 1, true));
  }

  expenseTypeSelectorChanged(event) {
    console.log(event, event.target.value);
    this.setState({
      expenseType: event.target.value
    }, this.fetchExpenses.bind(this, 1, true))
  }

  fetchExpenses(page, fromStart) {
    const {startDate, endDate, expenseType} = this.state;
    console.log('from fetch', startDate, endDate);
    this.setState({loading: true});
    return Helper.authFetch('get', 'record_list', null, {
      page: page,
      startDate: startDate,
      endDate: endDate,
      expenseType: expenseType
    }).then(data => {
      const currentRecords = fromStart ? [] : this.state.records;
      const next = data.next ? page += 1 : null;
      console.log('results', data.results);
      this.setState({
        records: [...currentRecords, ...data.results],
        loading: false,
        next: next
      })
    })
  }

  render() {
    const {records, loading,
      next, selectedMonth,
      expenseTypeSelectorOptions, expenseType
      } = this.state;
    return (
      <div>
        <div>{MonthSelector(selectedMonth, this.monthSelected)}</div>
        <div>
          { ExpenseTypeSelector(
              expenseType,
              this.expenseTypeSelectorChanged,
              expenseTypeSelectorOptions
          )}
        </div>
        {records ?
          <table className='table-striped table'>
            <tbody>
            <tr>
              <th>Time</th>
              <th>Name</th>
              <th>Amount</th>
            </tr>
            {records.map(record => {
              return Record(record)
            })}
            </tbody>
          </table> :
          <div>No Records</div>
        }
        {next ?
          <button onClick={this.fetchExpenses.bind(this, next, false)}>
            Load More
          </button> :
          <p>End</p>
        }

      </div>
    )
  }
}

const Record = (record)=>
  <tr key={record.id}>
    <td>{moment(record.time).format('D MMM')}</td>
    <td>
      <span style={{'font-weight':'bold'}}>{record.name}</span> <br/>
      {record.type} - {record.category} <br/>
      <span></span>
    </td>
    <td>{record.amount}</td>
  </tr>


const MonthSelector = (value, onChange)=>
  <select style={{display: 'block'}} value={value} onChange={onChange}>
    {moment.monthsShort().map((month, index) => {
      return <option key={month} value={index}>{month}</option>
    })}
  </select>

const ExpenseTypeSelector = (value, onChange, options) =>
  <select value={value} onChange={onChange}>
    {options.map(option => {
      return <option key={option}  value={option}>{option}</option>
    }) }
  </select>


export default RecordList
