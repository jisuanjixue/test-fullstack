import React, {Component} from 'react';
import fetch from 'isomorphic-unfetch';

interface dataProps {
  data: any
}

export default class extends Component<dataProps> {
  state = {
    field: {
      userName: '',
      password: ''
    },
    errors: null
  }

  async postRegister(params) {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    this.setState({
      errors: data.errors
    });
  }

  onChangeField = (e): void => {
    const value = e.target.value;
    const name = e.target.name;
    const {field} = this.state;
    field[name]= value;
    this.setState({field});
  }

  addUser = (e) => {
    this.postRegister(this.state.field);
    e.preventDefault();
  }

  render() {
    const {data} = this.props;
    const {field, errors} = this.state;
    return (
      <div>
        <form>
            <div>
                <label>your nick</label>
                <input 
                  type="text" 
                  name="userName" 
                  onChange={this.onChangeField}
                />
            </div>
            <p>{errors && errors.userName && errors.userName.message}</p>
            <div>
                <label>description</label>
                <input 
                  type="password" 
                  name="password" 
                  onChange={this.onChangeField} 
                />
            </div>
            <p>{errors && errors.password && errors.password.message}</p>
            <button onClick={this.addUser}>submit</button>
        </form>
      </div>

    );
  }
}