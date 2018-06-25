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
      <div style={{display:'flex'}}>
        <div style={{flex: 1}}>
          {MonthSelector(
              this.state.selectedMonth,
              this.monthSelected.bind(this))}
        </div>
        <div style={{flex: 1}}>
          <select className="form-control" value={this.state.selectedExpenseType}
                  onChange={this.expenseTypeChanged.bind(this)}>
            <option value="all">All</option>
            <option value="Personal">Personal</option>
            <option value="Household">Household</option>
          </select>
        </div>
      </div>
      <hr/>
      {type_summary ?
          <ul className="list-group">
            <li style={{display: 'flex', justifyContent: 'space-between'}} className="list-group-item">Personal
              <span>${type_summary.Personal.toFixed(2)}</span></li>
            <li className="list-group-item">Household</li>
            {type_summary.Household.map((d, index) => {
              return <li key={index} style={{display: 'flex', justifyContent: 'space-between'}}
                         className="list-group-item">
                {d.user__username}
                <span>${d.total.toFixed(2)}</span>
              </li>
            })}
          </ul>
          : null}
      {category_summary ?
          <div>
            <h5 style={{marginTop: '20px'}}>Category Summary</h5>
            <ul className="list-group">
              {category_summary.map((c, index) => {
                return <li className="list-group-item" style={{display:'flex', justifyContent: 'space-between'}}>
                  <span>{c[0]}</span> <span>${c[1].toFixed(2)}</span>
                </li>
              })}
            </ul>
          </div>
          : null
      }
    </div>
  }
}

const MonthSelector = (value, onChange, style = {})=> {
  return <select className="form-control" style={style}
                 value={value}
                 onChange={onChange}>
    {moment.monthsShort().map((month, index) => {
      return <option key={month} value={index+1}>{month}</option>
    })}
  </select>
}

export default Summary
