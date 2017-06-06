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

  createCategory(event) {
    event.preventDefault();
    Helper.authFetch('post',
        'category_list', {
          name: this.state.newCategoryName,
          cat_type: this.state.newCategoryType
        }).then(resp => {
          var currentCats = this.state.categories.slice();
          console.log('current cats', currentCats);
          currentCats.unshift(resp);
          console.log(currentCats);
          this.setState({categories: currentCats})
        })
  }

  render() {
    const {categories, newCategoryName, newCategoryType} = this.state;
    return (
        <div>
          {categories.length ?
              categories.map(cat => {
                return <div key={cat.id}>{cat.name} ({cat.cat_type})</div>
              }) : <div>No Categories</div>
          }
          <hr/>
          <form onSubmit={this.createCategory.bind(this)}>
            <div>
              <h3>Create New Category</h3>
              <div style={{'margin-bottom': '10px'}}>
                <label>Category Name: </label>
                <input type="text"
                       required
                       value={newCategoryName}
                       name='newCategoryName'
                       onChange={this.inputChanged.bind(this)}
                    />
              </div>
              <div>
                <label>Category Type</label>
                <select name="cat_type"
                        required
                        value="newCategoryType"
                        name='newCategoryType'
                        onChange={this.inputChanged.bind(this)}
                    >
                  <option value="Personal">Personal</option>
                  <option value="Household">Household</option>
                </select>
              </div>
            </div>
            <button className="btn btn-ok float-right">Create</button>
            <p>{JSON.stringify(newCategoryName)}</p>
            <p>{JSON.stringify(newCategoryType)}</p>
          </form>

        </div>

    )
  }
}

export default Category;