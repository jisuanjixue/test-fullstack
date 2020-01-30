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
    errors: null,
    error: ''
  }

  async postLogin(params) {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if(data.errors || data.error){
      this.setState({
        errors: data.errors,
        error: data.error
      });
    } else {
      sessionStorage.setItem('token', data.access_token);
      location.href = '/';
    }
    
  }

  onChangeField = (e): void => {
    const value = e.target.value;
    const name = e.target.name;
    const {field} = this.state;
    field[name]= value;
    this.setState({field});
  }

  login = (e) => {
    this.postLogin(this.state.field);
    e.preventDefault();
  }

  render() {
    const {errors, error} = this.state;
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
            <p>{error}</p>
            <button onClick={this.login}>submit</button>
        </form>
      </div>

    );
  }
}