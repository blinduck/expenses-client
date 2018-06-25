import React, {Component} from 'react';
import { Link, withRouter, Route, Switch } from 'react-router-dom'

export class LandingPage extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (<div>
      Testing
    </div>)
  }
}


export default withRouter(LandingPage)