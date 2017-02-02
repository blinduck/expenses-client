import React, {Component} from 'react';
import Helper from './helpers.js'

export class Category extends Component {
  constructor(props) {
    super(props)
    this.setTitle = props.setTitle;
    this.state = {
      categories: [],
      count: null,
      next: null,
      current: 1,
      newCategory: ''
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

  createCategory(event) {
    event.preventDefault();
    Helper.authFetch('post',
        'category_list',
        {name: this.state.newCategory}).then(resp => {
          var currentCats = this.state.categories.slice();
          console.log('current cats', currentCats);
          currentCats.unshift(resp);
          console.log(currentCats);
          this.setState({categories: currentCats})
        })
  }

  render() {
    const {categories, newCategory} = this.state;
    return (
        <div>
          {categories.length ?
              categories.map(cat => {
                return <div key={cat.id}>{cat.name}</div>
              }) : <div>No Categories</div>
          }
          <hr/>
          <form onSubmit={this.createCategory.bind(this)}>
            <div className="form-input">
              <label> Create New Category</label>
              <input type="text"
                     required
                     value={newCategory}
                     name='newCategory'
                     onChange={this.inputChanged.bind(this)}
                  />
            </div>
            <button className="btn btn-ok float-right">Create</button>
          </form>

        </div>

    )
  }
}

export default Category;