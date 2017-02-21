import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'
import Helper from './helpers.js'
import Datetime from 'react-datetime'

const Input = (label, name, type, value, onChange)=>
  <div>
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange}/>
  </div>

export class Create extends Component{
  constructor(props){
    super(props);
    this.state = {
    };
    this.setTitle = props.setTitle;
    this.createRecord = this.createRecord.bind(this);
    this.timeChanged = this.timeChanged.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
    this.resetForm = this.resetForm.bind(this);
  };


  emptyRecord(data){
    // creates an empty initial record used to set the base state
    return {
      user: Helper.getUser().id,
      name: '',
      amount: '',
      category: '',
      masterbudget: '',
      time: new Date(),
      type: data.record_type_choices[0]
    }
  }

  createRecord(event){
    // create the record on the server
    event.preventDefault();
    const record = this.state.record;
    Helper.authFetch('post', 'create_record', record).then((data) => {
      console.log('reset run');
      this.resetForm();
    }).catch(error => console.log('error caught'))

  }

  resetForm(){
    const emptyRecord = this.emptyRecord(this.state.baseData);
    this.setState({record: emptyRecord});
  }
  componentDidMount() {
    // need to fetch the list of budgets and categories that the user
    // has
    Helper.authFetch('get', 'base_data').then((data) => {
      this.setState({baseData: data});
      this.setState({record: this.emptyRecord(data)});
    })
    this.setTitle('Add');
  }
  timeChanged(value) {
    const record = this.state.record;
    const newRecord = {
      ...record,
      time: value
    };
    this.setState({record: newRecord})
  }
  inputChanged(varName, event) {
    const record = this.state.record;
    const newRecord = {
      ...record,
      [varName]: event.target.value
    };
    this.setState({record: newRecord})
  }

  render(){
    return (
      <div>
        {this.state.baseData && this.state.record ?
          <div>
            <form onSubmit={this.createRecord}>
              <div className='form-input'>
                <label>Name:</label>
                <input type="text" name='name'
                       value={this.state.record.name}
                       onChange={this.inputChanged.bind(this, 'name')} required/>
              </div>

              <div className="form-input">
                <label> Amount:</label>
                <input type="number" name='amount'
                  value={this.state.record.amount}
                       onChange={this.inputChanged.bind(this, 'amount')}
                       required
                  />
              </div>

              <div className="form-input">
                <label>Time:</label>
                <Datetime onChange={this.timeChanged} value={this.state.record.time}/>
              </div>

              <div className="form-input">
                <label>Category</label>
                <select name="category" onChange={this.inputChanged.bind(this, 'category')}>
                  <option value="">---</option>
                  {this.state.baseData.categories.map((cat) => {
                    return <option key={cat.id} value={cat.id}>{cat.name}</option>
                  })}
                </select>
              </div>

              <div className="form-input">
                <label>Budget</label>
                <select name="masterbudget" onChange={this.inputChanged.bind(this, 'masterbudget')}>
                  <option value="">---</option>
                  {this.state.baseData.masterbudgets.map((mb)=> {
                    return <option key={mb.id} value={mb.id}>{mb.name}</option>
                  })}
                </select>
              </div>

              <div className="form-input" onChange={this.inputChanged.bind(this, 'type')}>
                <label>Type</label>
                <select name='type'>
                  {this.state.baseData.record_type_choices.map((type)=> {
                    return <option key={type} value={type}>{type}</option>
                  })}
                </select>
              </div>

              <button className='btn btn-block btn-ok' type="submit">Add</button>
            </form>

          </div>

          : <div>Loading..</div>}

      </div>
    )
  }
}


export default Create

