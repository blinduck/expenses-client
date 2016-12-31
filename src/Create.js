import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router'

export const Create = () =>
  <div>
    <h1>Create view</h1>
    <div>Form here</div>
    <Link to="/home">Back home</Link>
  </div>

export default Create

