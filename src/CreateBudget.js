import React, {Component} from 'react';
import Helper from './helpers.js'
import { Link, browserHistory } from 'react-router'

export class CreateBudget extends Component {
  constructor(props){
    super(props);
    this.setTitle = props.setTitle;
    this.inputChanged = this.inputChanged.bind(this);
    this.state = {
      name: '',
      amount: '',
      expense_type: 'Personal',
      period: "Monthly",
      period_options: ['Monthly', 'Weekly', 'Daily'],
      expense_options: ['Personal', 'Household']
    }
  }

  inputChanged(event){
    this.setState({[event.target.name]: event.target.value})
  }

  createBudget(event){
    event.preventDefault();
    Helper.authFetch('post', 'masterbudget_list', this.state).then(resp => {
      if (resp.ok) {return resp.json()}
    }).then(data => {
      console.log('data', data);
      browserHistory.push('/home')
    });
    console.log('send', this.state);
  }

  componentDidMount(){
    this.setTitle('Create Budget')
  }

  render() {
    const {name, amount, expense_type, period} = this.state;
    return (
        <div>
          <form onSubmit={this.createBudget.bind(this)}>
            <div className="form-input">
              <label>Name:</label>
              <input type="text"
                     name="name" required
                     value={name} onChange={this.inputChanged} />
            </div>
            <div className="form-input">
              <label>Amount</label>
              <input type="number"
                     min='0' step='0.01'
                     name="amount" required
                     value={amount} onChange={this.inputChanged} />
            </div>
            <div className="form-input">
              <label>Period</label>
              <select name="period" onChange={this.inputChanged}>
                {
                  this.state.period_options.map(option => {
                    return <option key={option} value={option}>{option}</option>
                  })
                }
              </select>
            </div>
            <div className="form-input">
              <label>Type</label>
              <select name="expense_type" onChange={this.inputChanged}>
                {
                  this.state.expense_options.map(option => {
                    return <option key={option} value={option}>{option}</option>
                  })
                }
              </select>
            </div>
            <button className="btn btn-ok float-right" type='submit'>Create</button>
          </form>
          <div>
            {Object.keys(this.state).map(key => {
              return <div>{key} : {this.state[key]}</div>
            })}
          </div>
        </div>
    )
  }
}

export default CreateBudget