import React, { Component } from 'react';
import { Link, withRouter, Route, Switch } from 'react-router-dom'
import Helper from './helpers.js'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify';
import Home from "./Home.js";
import Create from './Create.js';
import RecordList from './RecordList';
import Category from './Category.js';
import Summary from './Summary.js'
import BudgetsWithRecords from './BudgetsWithRecords.js'
import CategoryForm from './CategoryForm.js'
import CreateBudget from './CreateBudget.js'
import LandingPage from './Landing'

class Base extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
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
    this.props.history.push('/login');
  }
  goTo(name, event){
    event.preventDefault();
    this.setState({open: false}, this.props.history.push.bind(this, name))
  }
  toggleDrawer() {
    const current = this.state.open;
    this.setState({open: !current});
  }
  closeDrawer() {
    this.setState({open: false});
  }
  componentDidMount(){
    if (!Helper.isLoggedIn()) {this.props.history.push('/login')}
  }


  render(){
    return (
      <div>
        <div className={this.state.open ? "drawer drawer-open" : "drawer"}>
          <button
            onClick={this.closeDrawer}
            style={{
              float: 'right',
              border: 'none',
              background: "none",
              fontSize: '30px',
              cursor: "pointer"
            }}><i className="fas fa-window-close"></i></button>
          <ul>
            <li>
              <a href="" onClick={this.goTo.bind(this, "/home")}>
                Home
              </a>
            </li>
            <li>
              <a href="" onClick={this.goTo.bind(this, '/expenses')}>
                All Expenses
              </a>
            </li>
            <li>
              <a href="" onClick={this.goTo.bind(this, '/categories')}>
                Categories
              </a>
            </li>
            <li>
              <a href="" onClick={this.goTo.bind(this, '/summary')}>
               Summary
              </a>
            </li>
            <li> <a href="" onClick={this.logout}>Logout</a>
            </li>
          </ul>
        </div>
        <div style={{display: 'flex', 'alignItems': 'center', marginTop: '10px'}}>
          <button style={{margin: "6px", background:'none', border:'none'}}
                  onClick={this.toggleDrawer}>
            <img src="/menu.svg" alt="menu" style={{height: '48px'}}/>
          </button>
          <h2 style={{'alignSelf':'center', flex: 1, marginTop: '8px'}}>{this.state.title}</h2>
          <button
              className="btn btn-ok"
              style={{display: this.props.location.pathname == '/create' ? 'none': 'block'}}
              onClick={this.goTo.bind(this, '/create')}>Add</button>
        </div>
        <div className='container-fluid' style={{marginTop: '12px'}}>
          <Switch>
            <Route path="/home" render={()=> <Home setTitle={this.setTitle}/>}/>
            <Route path="/create" render={()=> <Create setTitle={this.setTitle}/>}/>
            <Route path="/expenses/:id" render={()=> <Create setTitle={this.setTitle}/>}/>
            <Route path="/expenses" render={()=> <RecordList setTitle={this.setTitle}/>}/>
            <Route path="/categories/:id" render={()=> <CategoryForm setTitle={this.setTitle}/>}/>
            <Route path="/categories" render={()=> <Category setTitle={this.setTitle}/>}/>
            <Route path="/new_category" render={()=> <CategoryForm setTitle={this.setTitle}/>}/>
            <Route path="/summary" render={()=> <Summary setTitle={this.setTitle}/>}/>
            <Route path="/create-budget" render={()=> <CreateBudget setTitle={this.setTitle}/>}/>
            <Route name='budgetWithRecords' path="/budgets/:id" render={({match})=> <BudgetsWithRecords setTitle={this.setTitle} match={match}/>}/>
          </Switch>
        </div>
        <ToastContainer position='bottom-center' autoClose={1000} hideProgressBar={true}/>
      </div>
    )
  }
}
//{this.props.children && React.cloneElement(this.props.children, {
//  setTitle: this.setTitle
//})}

export const Toasty = (props)=>  {
  return <div style={{display: 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'minHeight': '62px'}}>
        <div className="lead">{props.message}</div>
      </div>
};

export default withRouter(Base)
