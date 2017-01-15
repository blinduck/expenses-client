import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'
import Helper from './helpers.js'

export class Base extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.goTo = this.goTo.bind(this);
    this.state = {
      open: false
    }
  }
  logout(event){
    event.preventDefault();
    Helper.logOut();
  }
  goTo(name, event){
    event.preventDefault();
    this.setState({open: false}, browserHistory.push.bind(this, name))
  }
  toggleDrawer() {
    const current = this.state.open;
    this.setState({open: !current});
    console.log(this.state);
  }
  closeDrawer() {
    this.setState({open: false});
  }
  componentDidMount(){
    if (!Helper.isLoggedIn()) {browserHistory.push('/login')}
  }


  render(){
    return (
      <div>
        <div className={this.state.open ? "drawer drawer-open" : "drawer"}>
          <button
            onClick={this.closeDrawer}
            style={{float: 'right', margin: '15px'}}> Close</button>
          <ul>
            <li>
              <a href="" onClick={this.goTo.bind(this, "/home")}>Home</a>
            </li>
            <li>
              <a href="" onClick={this.goTo.bind(this, '/create')}>Create</a>
            </li>
            <li>
              <a href="" onClick={this.goTo.bind(this, '/expense-list')}>Expense List</a>
            </li>
            <li>
              <a href="" onClick={this.logout}>Logout</a>
            </li>
          </ul>
        </div>
        <button style={{margin: "15px"}}
          onClick={this.toggleDrawer}>
          Menu
        </button>
        <div style={{padding: '15px'}}>
          {this.props.children}
        </div>
      </div>


    )
  }
}

export default Base
