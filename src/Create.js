import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'
import Helper from './helpers.js'
import Datetime from 'react-datetime'
import Pills from './Pills.js'
import { toast } from 'react-toastify';
import {Toasty} from './Base.js';

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
      categories: new Set(),
      masterbudget: null,
      time: new Date(),
      type: data.record_type_choices[0]
    }
  }
  
  categorySelected = (category) => {
    const {record, baseData} = this.state;
    category.selected = !category.selected;
    category.selected ? record.categories.add(category.id) : record.categories.delete(category.id);
    this.setState({record, baseData}, ()=> {
      console.log(this.state.record);
    });
  }
  budgetSelected = (mb)=> {
    const {record, baseData} = this.state;
    this.setState({
      record: {
        ...record,
        masterbudget: mb.id,
        masterbudgetName: mb.name,
      },
      baseData: {
        ...baseData,
        masterbudgets: baseData.masterbudgets.map(master => {
          master.selected = master.id === mb.id;
          return master;
        })
      }
    })
  }
  recordTypeSelected = (choice) => {
    const {record, baseData} = this.state;
    this.setState({
      baseData: {
        ...baseData,
        record_type_choices: baseData.record_type_choices.map((c)=> {
          c.selected = c.id === choice.id
          return c
        }),
        masterbudgets: baseData.masterbudgets.map(c => {c.selected = false; return c})
      },
      record: {
        ...record,
        type: choice.name,
        masterbudget: null
      }
    })
  }
  clearPills = (baseDataField, recordField)=>{
    const {baseData, record} = this.state;
    this.setState({
      baseData: {
        ...baseData,
        [baseDataField]: baseData[baseDataField].map(c => {c.selected = false; return c})
      },
      record: {
        ...record,
        [recordField]: null
      }
    })
  }

  createRecord(event){
    // create the record on the server
    event.preventDefault();
    const record = this.state.record;
    record.categories = Array.from(record.categories)
    Helper.authFetch('post', 'create_record', record).then((data) => {
      console.log('reset run');
      toast(<Toasty message="Expense Added"></Toasty>)
      browserHistory.push('/home');
      //this.resetForm();
    }).catch(error => console.log('error caught'))

  }

  printRecord(){
    for (let x in this.state.record) {
      console.log(x, this.state.record[x]);
    }
  }

  resetForm(){
    const emptyRecord = this.emptyRecord(this.state.baseData);
    const baseData = this.state.baseData;
    const {categories, masterbudgets} = baseData;
    this.setState({
      record: emptyRecord,
      baseData: {
        ...baseData,
        categories: categories.map(cat=> {cat.selected = false; return cat}),
        masterbudgets: masterbudgets.map(mb => {mb.selected = false; return mb}),
      }
    });
  }
  componentDidMount() {
    // need to fetch the list of budgets and categories that the user
    // has
    Helper.authFetch('get', 'base_data').then((data) => {
      const {record_type_choices, masterbudgets, categories} = data;
      this.setState({
        baseData: {
          ...data,
          record_type_choices: record_type_choices.map((choice, index)=> {
            return {name: choice, id: index, selected: index===0, verbose: choice}
          }),
          categories: categories.map(c => {
            c.selected = false;
            c.verbose = c.name;
            return c;
          }),
          masterbudgets: masterbudgets.map(mb => {
            mb.selected = false;
            mb.verbose = mb.name;
            return mb;
          })
        },
        record: this.emptyRecord(data)
      }, ()=>
      {console.log('basedata',this.state.baseData);
      }
      );
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
    const {record} = this.state;
    const {baseData} = this.state;
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
                <Datetime onChange={this.timeChanged}
                          value={this.state.record.time}
                    input={false}/>
              </div>

              <div className="form-input">
                <label>
                  Categories
                </label>
                 <Pills
                 pills={baseData.categories}
                 keyField='id' onChange={this.categorySelected.bind(this)}>
                 </Pills>
              </div>

              <div className="form-input" onChange={this.inputChanged.bind(this, 'type')}>
                <label>Type</label>
                 <Pills pills={baseData.record_type_choices}
                 keyField='name' onChange={this.recordTypeSelected.bind(this)}></Pills>
              </div>
              <div className="form-input">
                <label>Budget: {record.masterbudget ?
                  <span>{record.masterbudgetName} <button
                      onClick={this.clearPills.bind(this, 'masterbudgets', 'masterbudget')} type='button'>Remove</button>
                  </span>
                    : 'None'
                }</label>
                <Pills
                    pills={baseData.masterbudgets.filter(mb=> {return mb.expense_type === record.type})}
                    keyField='id' onChange={this.budgetSelected.bind(this)}></Pills>
              </div>

              <button className='btn btn-block btn-ok' type="submit">Add</button>
            </form>

          </div> : <div>Loading..</div> }
          <button className="btn btn-block" onClick={this.printRecord.bind(this)}>print</button>
      </div>
    )
  }
}


export default Create

