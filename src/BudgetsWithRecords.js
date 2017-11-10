import React, {Component} from 'react';
import Helper from './helpers.js'
import _ from 'lodash';
import moment from 'moment'
window._ = _;

export default class BudgetsWithRecords extends Component {
  constructor(props) {
    super(props)
    console.log('props', props);
    this.setTitle = props.setTitle;
    this.state = {
      budgets: [],
      loading: true,
    }
  }

  fetchData(mb_id, page = 1) {
    Helper.authFetch('get', 'budgets_with_records', null,
        {
          mb_id: mb_id,
          page: page

        })
        .then(resp => {
          console.log(resp)
          this.setState({
            budgets: resp.results,
            loading: false,
          })
          this.setTitle(resp.budgetName)
        }
    )
  }

  componentDidMount() {
    this.fetchData(this.props.match.params.id)
  }


  render() {
    let {budgets, loading} = this.state;
    return <div>
      { !loading ?
          <div>
            { budgets.map(b=> {
              return <div key={b.id}>
                <p>{b.masterbudget} {moment(b.start_time).format('D MMM')} to {moment(b.end_time).format('D MMM')} </p>
                <p>Remainder: {b.remainder}</p>
                { b.records.map((r,x) => {
                  return <p key={r.id}>{x+1}. {r.name}: {r.amount}</p>
                })}
                <hr/>
              </div>
            })}
          </div>
          : <div>Loading..</div>
      }
    </div>
  }
}