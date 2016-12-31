import React, { Component } from 'react';
//import './App.css';
import { Link, browserHistory } from 'react-router'

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'deepan',
      password: 'password',
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
    const {username, password } = this.state;
    const url = `${window.app.baseUrl}/token`;
    const data = JSON.stringify({username, password});
    fetch(url, {
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
      window.app.token = data.token;
      browserHistory.push('/home')
    }).catch(error => console.log(error));
  }
  render() {
    const {username, password, errors} = this.state;
    return (
      <div>
        <h2>Expenses</h2>
        <form onSubmit={this.login}>
          <div>
            <label>Username: </label>
            <input type="text" onChange={this.onInputChange} value={username} name='username'/>
          </div>
          <div>
            <label>Password:</label>
            <input type="password" onChange={this.onInputChange} value={password} name='password'/>
          </div>
          {errors ? <div>Username or Password is incorrect</div> : null}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}


export default Login

