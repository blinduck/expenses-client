import moment from 'moment'
import Helper from '../helpers.js'

export class Record {
  constructor(data={}, user_id=null) {
    //for (let k in data) {
    //  this[k] = data[k]
    //}
    this.id = data.id;
    this.user = data.user || Helper.getUser().id;
    this.name = data.name || '';
    this.amount = data.amount || '';
    this.categories = new Set(data.categories || []);
    this.masterbudget = data.masterbudget || null;
    this.masterbudgetName = data.masterbudgetName || null;
    this.time = moment(data.time || new Date());
    this.type = data.type || 'Personal';
    this.type_choices = ['Personal', 'Household'];
  }

  createRecord(){
    return Helper.axFetch('post', 'records', this);
  }

  updateRecord() {
    return Helper.axFetch('put',  `records/${this.id}`, this)
  };

  static fetchRecord(id) {
    return Helper.axFetch('get', `records/${id}`).then(resp => {
      console.log('record data from server', resp.data);
      return new Record(resp.data)
    })
  }

}

export default Record