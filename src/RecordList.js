import React, { Component } from 'react';
import { Link } from 'react-router-dom'
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

  onDelete(record, index, event) {
    console.log('args', record, index, event);
    if (event) event.preventDefault();
    console.log('delete', record, index);
    if (confirm(`Delete ${record.name}?`)) {
      Helper.axFetch('delete', `records/${record.id}`).then(resp => {
        let records = this.state.records;
        records.splice(index, 1)
        this.setState({records})
      })
    }
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
    if (loading) {
      return (<div>
        Loading...
      </div>)
    }
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
                  <th>Budget</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
                {records.map((record, index) => {
                  return <RecordView key={index} record={record} onDelete={this.onDelete.bind(this, record, index)}/>
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

class RecordView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seeOptions: false
    }
  }

  render() {
    let record = this.props.record;
    let onDelete = this.props.onDelete;
    let seeOptions = false;
    return <tr key={record.id}>
      <td>{moment(record.time).format('D MMM')}</td>
      <td>
        <span style={{'fontWeight': 'bold'}}>{record.name}</span> <br/>
        {record.categories.map(c => c.name).join(", ")} <br/>
        <span></span>
      </td>
      <td>{record.masterbudget || 'None'}</td>
      <td>{record.type}</td>
      <td>{record.amount}</td>
      <td style={{position: 'relative'}} onClick={() => this.setState(current => this.setState({ seeOptions: !current.seeOptions }))}>
        <div style={{
          position: 'absolute',
          top: '52px',
          border: '1px solid grey',
          width: '90px',
          right: '0px',
          textAlign: 'center',
          background: 'white',
          zIndex: '10'
          }} className={this.state.seeOptions ? '' : 'nodisplay'}>
          <p> <Link to={{pathname: `expenses/${record.id}`}}>Edit</Link> </p>
          <p>
            <a href="" onClick={(event) => {
            event.preventDefault();
            this.setState({seeOptions: false}, () => {
             onDelete()
            });
          }
          }>Delete</a>
          </p>
        </div>
        <div onClick={() => this.setState({seeOptions: !this.state.seeOptions})} style={{textAlign: 'center'}}>
          <i className="fas fa-caret-down"></i>
        </div>
      </td>
    </tr>
  }
}

const MonthSelector = (value, onChange)=>
    <select style={{display: 'block'}} value={value} onChange={onChange}>
      {moment.monthsShort().map((month, index) => {
        return <option key={month} value={index}>{month}</option>
      })}
    </select>

const ExpenseTypeSelector = (value, onChange, options) =>
    <select value={value} onChange={onChange}>
      {options.map(option => {
        return <option key={option} value={option}>{option}</option>
      }) }
    </select>


export default RecordList
