import React, { Component } from 'react';
//import './App.css';
import { Link} from 'react-router-dom'
import Helper from './helpers.js'
import {withRouter} from 'react-router-dom'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: false
    };
    this.login = this.login.bind(this);
    this.onInputChange = this.onInputChange.bind(this)
  }
  onInputChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }
  login(event) {
    event.preventDefault();
    const {username, password} = this.state;
    const url = `${Helper.baseUrl()}/login`;
    const data = JSON.stringify({username, password});
    fetch(Helper.api_url('login'), {
      method: 'post',
      headers: new Headers({'content-type': 'application/json'}),
      body: data
    }).then(resp => {
      if (resp.ok) return resp.json();
      else {
        this.setState({errors: true});
        throw "Unsuccessful Login"
      }
    }).then(data => {
      Helper.storeToken(data.auth_token);
      Helper.setUser(data);
      console.log('user', Helper.getUser());
      //browserHistory.push('/home')
      this.props.history.push('/home')
    }).catch(error => console.log(error));
  }
  render() {
    const {username, password, errors} = this.state;
    return (
      <div className='container'>
        <h2>Expenses</h2>
        <form onSubmit={this.login}>
          <div className='form-input'>
            <label>Email: </label>
            <input type="text" onChange={this.onInputChange} value={username} name='username'/>
          </div>
          <div className='form-input'>
            <label>Password:</label>
            <input type="password" onChange={this.onInputChange} value={password} name='password'/>
          </div>
          {errors ? <div>Username or Password is incorrect</div> : null}
          <button className="btn btn-ok btn-block" type="submit">Login</button>
        </form>
        <Link to="/signup" className='center-text'>Don't have an account? Sign Up</Link>
      </div>
    );
  }
}


export default withRouter(Login)

