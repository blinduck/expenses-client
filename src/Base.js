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
    this.setTitle = this.setTitle.bind(this);
    this.state = {
      open: false,
      title: 'Dollar Dollar'
    }
  }

  setTitle(value){
    this.setState({title: value})
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
              <a href=""
                 onClick={this.goTo.bind(this, "/home")}>
                Home
              </a>
            </li>
            <li>
              <a href=""
                 onClick={this.goTo.bind(this, '/create')}>
                Create
              </a>
            </li>
            <li>
              <a href=""
                 onClick={this.goTo.bind(this, '/expense-list')}>
                All Expenses
              </a>
            </li>
            <li>
              <a href=""
                 onClick={this.goTo.bind(this, '/categories')}>
                Categories
              </a>
            </li>
            <li>
              <a href="" onClick={this.logout}>Logout</a>
            </li>
          </ul>
        </div>
        <div style={{display: 'flex'}}>
          <button style={{margin: "6px", background:'none', border:'none'}}
                  onClick={this.toggleDrawer}>
            <img src="menu.svg" alt="menu" style={{height: '48px'}}/>
          </button>
          <h1 style={{'align-self':'center'}}>{this.state.title}</h1>
        </div>
        <div className='container'>
          {this.props.children && React.cloneElement(this.props.children, {
            setTitle: this.setTitle
          })}
        </div>
      </div>
    )
  }
}

export default Base
