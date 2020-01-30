import React, {Component} from 'react';
import fetch from 'isomorphic-unfetch';

interface dataProps {
  data: any
}

export default class extends Component<dataProps> {
  state = {
    field: {
      title: '',
      description: ''
    },
    errors: null
  }

  static async getInitialProps(context) {
    const { id } = context.query;
    if(id){
      const res = await fetch(`http://localhost:3000/polls/${id}`);
      const data = await res.json();
      return { data: data }
    } else {
      return {
        data: {
          title: '',
          description: ''
        }
      }
    }
    
  }

  async postPoll(params) {
    const token = sessionStorage.getItem('token');
    const res = await fetch('http://localhost:3000/polls', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    console.log('postPoll', data)
    if(data.errors){
      this.setState({
        errors: data.errors
      });
    } else {
      location.href="/"
    }
    
  }

  addPoll = (e): void => {
    this.postPoll(this.state.field);
    e.preventDefault();
  }

  onChangeField = (e): void => {
    const value = e.target.value;
    const name = e.target.name;
    const {field} = this.state;
    field[name]= value;
    this.setState({field});
  }

  render() {
    const {data} = this.props;
    const {field, errors} = this.state;
    return (
      <div>
        <form>
            <div>
                <label>title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={data.title || field.title}
                  onChange={this.onChangeField}
                />
            </div>
            <p>{errors && errors.title && errors.title.message}</p>
            <div>
                <label>description</label>
                <input 
                  type="text" 
                  name="description" 
                  value={data.description || field.description}
                  onChange={this.onChangeField} 
                />
            </div>
            <p>{errors && errors.description && errors.description.message}</p>
            <button onClick={this.addPoll}>submit</button>
        </form>
      </div>

    );
  }
}