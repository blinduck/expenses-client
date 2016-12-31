import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'

export class Base extends Component {
  render(){
    return (
      <div>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/expense-list">Expense List</Link>
            </li>
          </ul>
        {this.props.children}
      </div>

    )
  }
}

export default Base
