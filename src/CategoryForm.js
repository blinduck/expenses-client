import React, {Component} from 'react';
import Helper from './helpers.js'
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';
import {Toasty} from './Base.js';

//export class CategoryForm extends Component {
//  render() {
//    return (<div>works</div>)
//  }
//}

export class CategoryForm extends Component {
  constructor(props) {
    super(props)
    this.cat_id = props.match.params.id;
    this.state = {
      cat_id: props.match.params.id,
      loading: true,
      newCategoryName: '',
      newCategoryType: 'Personal'
    }
  }

  componentDidMount() {
    if (this.cat_id) {
      Helper.axFetch('get', `categories/${this.cat_id}`).then(resp => {
        this.setState({
          loading: false,
          newCategoryName: resp.data.name,
          newCategoryType: resp.data.cat_type,
        })
      })
    } else {
      this.setState({loading: false})
    }
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
          toast(<Toasty message="Category Created"></Toasty>)
          this.props.history.push('/categories');
        })
  }

  updateCategory(event) {
    event.preventDefault()
    Helper.axFetch('put', `categories/${this.state.cat_id}`, {
      'name': this.state.newCategoryName,
      'cat_type': this.state.newCategoryType
    }).then(resp => {
      toast(<Toasty message="Category Updated"></Toasty>)
      this.props.history.push('/categories');
    });
  }

  deleteCategory() {
    let c = confirm("Do you want to delete this category?");
    if (!c) return
    Helper.axFetch('delete', `categories/${this.state.cat_id}`).then(resp => {
      toast(<Toasty message="Category Deleted"></Toasty>)
      this.props.history.push('/categories');
      console.log('resp', resp);
    })
  }

  renderLoading() {
    return (
        <div>Loading</div>
    )
  }


  renderView() {
    const {newCategoryName, newCategoryType, cat_id} = this.state;
    return (<div>
      <h3>
        {cat_id ? 'Update' : 'Create'}
      </h3>

      <form onSubmit={cat_id ? this.updateCategory.bind(this) : this.createCategory.bind(this)}>
        <div>
          <div className="form-group">
            <label>Category Name: </label>
            <input type="text" className="form-control"
                   required
                   value={newCategoryName}
                   name='newCategoryName'
                   onChange={this.inputChanged.bind(this)}
                />
          </div>
          <div className="form-group">
            <label>Category Type</label>
            <select name="cat_type" className="form-control"
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
        <button className="btn btn-block btn-primary float-right">{this.state.cat_id ? 'Update' : "Create"}</button>
      </form>
      {cat_id ? <button className='btn btn-block btn-danger' onClick={this.deleteCategory.bind(this)}>Delete Category</button> : null}

    </div>)
  }

  render() {
    if (this.state.loading) {
      return this.renderLoading()
    }
    return this.renderView();
  }
}

export default withRouter(CategoryForm)
