import React, {Component} from 'react';
import Helper from './helpers.js'
import { Link, withRouter } from 'react-router-dom'

export class Category extends Component {
  constructor(props) {
    super(props)
    this.setTitle = props.setTitle;
    this.state = {
      categories: [],
      count: null,
      next: null,
      current: 1,
      newCategoryName: '',
      newCategoryType: 'Personal'
    }
  }

  componentDidMount() {
    this.setTitle("Categories")
    Helper.authFetch('get', 'category_list').then(resp => {
      console.log('resp', resp); 
      this.setState({
        categories: resp.results,
        count: resp.count,
        next: resp.next
      })
    })
  }

  inputChanged(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const {categories, newCategoryName, newCategoryType} = this.state;
    return (
        <ul className="list-group">
          {categories.length ?
              categories.map(cat => {
                return <li className="list-group-item" key={cat.id}>
                  <Link to={{pathname: `categories/${cat.id}`}}>
                    {cat.name} ({cat.cat_type})
                  </Link>
                </li>
              }) : <div>No Categories</div>
          }
          <Link className="btn btn-primary" to="/new_category">
            Create New Category
          </Link>
        </ul>

    )
  }
}

export default Category;