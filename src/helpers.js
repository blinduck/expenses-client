import { browserHistory } from 'react-router'
import docCookies from './docCookies.js'
import moment from 'moment';

class APIEndpoints {
  // assuming that /api/v1 is already taken into account

  static baseUrl(){return  'http://expenses.dev/api/v1'};

  static paramStr(params){
    const str = Object.keys(params).map(key=> {
      return key + '=' + params[key]
    }).join('&');
    return str

  }
  static login() {
    return this.baseUrl() + "/login";
  };
  static base_data(){
    return this.baseUrl() + '/base_data';
  }
  static create_record() {
    return this.baseUrl() + '/records'
  };
  static record_list(params) {
    let url = this.baseUrl() + '/records';
    if (params) url += '?' + this.paramStr(params)
    return url
  };
  static budget_list() {
    return  this.baseUrl() + '/budgets'
  }
  static masterbudget_list(){
    return this.baseUrl() + '/master_budgets'
  }
};

class Helper {
  static authFetch = (method, name, data=null, urlParams={}) => {
    console.log('params are:', urlParams);
    const requestDetails = {
      method: method,
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Token ${Helper.getToken()}`
      })
    };
    if (data) requestDetails.body = JSON.stringify(data);
    const r = new Request(Helper.api_url(name, urlParams), requestDetails);
    console.log('req' ,r);
    return fetch(r).then(resp => {
      if (resp.ok) {
        return(resp.json())
      } else {
        throw resp
      }
    })
  };

  static localTime = (time) => {
    return moment(time).format('D MMM LT')
  }

  static storeToken = (token)=>{
    docCookies.setItem('token', token)
  };
  static getToken = () => {
    const token = docCookies.getItem('token');
    return token;
  };

  static setUser = (data) => {
    docCookies.setItem('user', JSON.stringify(data))
  };

  static getUser = () => {
    return JSON.parse(docCookies.getItem('user'))
  };
  static logOut = ()=> {
    docCookies.removeItem('token');
    browserHistory.push('/login');
  };

  static isLoggedIn = ()=> {
    if (docCookies.getItem('token')) {
      return true
    }
    return false
  };

  static baseUrl = ()=> {
   return 'http://expenses.dev/api/v1'
  };

  static api_url = (name, params) => {
    return APIEndpoints[name](params)
  }

}

export default Helper;

