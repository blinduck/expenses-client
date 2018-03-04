import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import Helper from './helpers.js'
import Datetime from 'react-datetime'
import { toast } from 'react-toastify';
import {Toasty} from './Base.js';
import {Record} from './models/Record.js'

class Create extends Component {
  constructor(props) {
    super(props);
    this.record_id = props.match.params && props.match.params.id;
    this.state = {
      loading: true
    };
    this.setTitle = props.setTitle;
  }

  categorySelected = (category) => {
    let record = this.state.record;
    record.categories.has(category.id) ?
        record.categories.delete(category.id) :
        record.categories.add(category.id);
    this.setState({record});
  }
  budgetSelected = (mb)=> {
    let record = this.state.record;
    record.masterbudget = mb.id;
    record.masterbudgetName = mb.name;
    this.setState({record});
  }

  recordTypeSelected = (choice) => {
    // reset masterbudget if record type changes
    let record = this.state.record;
    record.type = choice;
    record.masterbudget = null;
    record.masterbudget = ''
    this.setState({record})
  }

  createOrUpdateRecord(event) {
    // create the record on the server
    event.preventDefault();
    const record = new Record(this.state.record);
    record.categories = Array.from(record.categories)
    let promise = record.id ? record.updateRecord() : record.createRecord();
    promise.then((data) => {
      toast(<Toasty message="Expense Added"></Toasty>)
      this.props.history.push('/home');
    }).catch(error => console.log('error caught'))

  }

  printRecord() {
    for (let x in this.state.record) {
      console.log(x, this.state.record[x]);
    }
  }

  componentDidMount() {
    this.record_id ? this.setTitle('Update') : this.setTitle('Add');
    let recordPromise = new Promise((resolve, reject) => {
      this.record_id ?
          resolve(Record.fetchRecord(this.record_id)) :
          resolve(new Record)
    })
    let baseDataPromise = Helper.authFetch('get', 'base_data');
    Promise.all([recordPromise, baseDataPromise]).then((results) => {
      let base_data = results[1]
      this.setState({
        ...base_data,
        record: results[0],
        loading: false
      });
    })
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

  render() {
    const {record, categories, masterbudgets, loading} = this.state;

    if (loading) return (<div>Loading...</div>)
    return (
        <div>
          <div>
            <form onSubmit={this.createOrUpdateRecord.bind(this)}>
              <div className='form-input'>
                <label>Name:</label>
                <input type="text" name='name'
                       value={record.name}
                       onChange={this.inputChanged.bind(this, 'name')} required/>
              </div>

              <div className="form-input">
                <label> Amount:</label>
                <input type="number" name='amount'
                       value={record.amount}
                       onChange={this.inputChanged.bind(this, 'amount')}
                       required
                    />
              </div>

              <div className="form-input">
                <Datetime onChange={this.timeChanged.bind(this)}
                          value={record.time}
                          input={false}/>
              </div>

              <div className="form-input">
                <label>
                  Categories
                </label>
                <section>
                  { categories.map(cat => {
                    return (<span
                        onClick={this.categorySelected.bind(this, cat)}
                        key={cat.id} className={record.categories.has(cat.id) ? 'pill selected' : 'pill'}>
                      {cat.name}
                    </span>)
                  }) }
                </section>
              </div>

              <div className="form-input" onChange={this.inputChanged.bind(this, 'type')}>
                <label>Type</label>
                <section>
                  {record.type_choices.map(rType => {
                    return <span
                        className={rType == record.type ? 'pill selected' : 'pill'}
                        onClick={this.recordTypeSelected.bind(this, rType)}
                        key={rType}>{rType}</span>
                  })}
                </section>
              </div>
              <div className="form-input">
                <label>Budget: {record.masterbudget ?
                    <span>{record.masterbudgetName}
                      <button
                          onClick={()=> { record.masterbudget = record.masterbudgetName = null;
                            this.setState({record}); }} type='button'>Remove
                      </button>
                  </span>
                    : 'None'
                }</label>

                <section>
                  { masterbudgets.filter(mb=> {
                    return mb.expense_type === record.type
                  }).map(mb => {
                    return <span onClick={this.budgetSelected.bind(this, mb)}
                                 key={mb.id} className={record.masterbudget == mb.id ? 'pill selected' : 'pill'}>
                      {mb.name}
                    </span>
                  })}
                </section>
              </div>
              <button className='btn btn-block btn-ok' type="submit">Add</button>
            </form>
          </div>
        </div>
    )
  }
}


export default withRouter(Create)

