import React, {Component} from 'react';
import Helper from './helpers.js'
import {Link, withRouter} from 'react-router-dom'

class SignUp extends Component {
  constructor(props){
    super(props)
    this.state = {
      household: 'something',
      username: 'deepan0710@gmail.com',
      password: 'password',
      password_repeat: 'password',
      errors: null
    }
  }

  createAccount = (event) => {
    event.preventDefault();
    const {household, username, password, password_repeat} = this.state;
    const formData = {household, username, password, password_repeat};
    if (password !== password_repeat) {
      this.setState({repeat_password_error: "Passwords Don't Match"});
      return
    }
    fetch(Helper.api_url('signup'), {
      method: 'post',
      headers: new Headers({'content-type': 'application/json'}),
      body: JSON.stringify(formData)
    }).then(resp => {
      if (resp.ok) return resp.json();
      throw resp.json();
    }).then(data => {
      Helper.storeToken(data.auth_token);
      Helper.setUser(data);
      this.props.history.push('/home');
    }).catch(error => {
      console.log('caught error', error);
      return error
    }).then(errorObj => {
      this.setState({errors: errorObj})
    })
  }
  inputChanged = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    const {household, username, password, password_repeat, errors} = this.state;
    return (
        <div className='container'>
          <h1>Sign Up</h1>
          <form onSubmit={this.createAccount.bind(this)}>
            <div className='form-input'>
              <label>Household Name </label>
              <input type="text" name='household' value={household} onChange={this.inputChanged.bind(this)} required/>
              {errors && errors.household ? <div>{errors.household}</div>: null}
            </div>
            <div className='form-input'>
              <label>Email</label>
              <input type="email" name='username' value={username} onChange={this.inputChanged.bind(this)} required/>
              {errors && errors.username ? <div>{errors.username}</div>: null}
            </div>

            <div className='form-input'>
              <label>Password</label>
              <input type="password" name='password' value={password} onChange={this.inputChanged.bind(this)} required/>
            </div>

            <div className='form-input'>
              <label>Repeat Password</label>
              <input type="password" name='password_repeat' value={password_repeat} onChange={this.inputChanged.bind(this)} required/>
              <p>{this.state.repeat_password_error}</p>
            </div>

            <button type="submit">Create Account</button>
          </form>
        </div>
    )
  }
}


export default withRouter(SignUp)
