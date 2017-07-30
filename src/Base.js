import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'
import Helper from './helpers.js'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify';

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
    //browserHistory.push('/home')
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
              <a href=""
                 onClick={this.goTo.bind(this, '/summary')}>
               Summary
              </a>
            </li>
            <li>
              <a href="" onClick={this.logout}>Logout</a>
            </li>
          </ul>
        </div>
        <div style={{display: 'flex', 'alignItems': 'center'}}>
          <button style={{margin: "6px", background:'none', border:'none'}}
                  onClick={this.toggleDrawer}>
            <img src="menu.svg" alt="menu" style={{height: '48px'}}/>
          </button>
          <h1 style={{'alignSelf':'center', flex: 1}}>{this.state.title}</h1>
          <button className="btn btn-ok" onClick={this.goTo.bind(this, '/create')}>Add</button>
        </div>
        <div className='container'>
          {this.props.children && React.cloneElement(this.props.children, {
            setTitle: this.setTitle
          })}
        </div>
        <ToastContainer position='bottom-center' autoClose={1000} hideProgressBar={true}/>
      </div>
    )
  }
}

export const Toasty = (props)=>  {
  return <div style={{display: 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'minHeight': '62px'}}>
        <div className="lead">{props.message}</div>
      </div>
}

export default Base
