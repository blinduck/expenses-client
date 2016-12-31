import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'

export const RecordList = () =>
  <div>
    <h1>Record List</h1>
    <div>Records Here</div>
    <Link to="/home">Back home</Link>
  </div>

export default RecordList
