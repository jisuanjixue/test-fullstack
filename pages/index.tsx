import React, {Component} from 'react';
import fetch from 'isomorphic-unfetch';
import { Poll } from '../components/poll';
import _ from 'lodash';

export default class extends Component {
  props: { 
    data: any;
    admin: boolean;
  };

  state = {
    list: []
  }

  socket: any

  componentDidMount() {
    this.connectWebsocket()
  }

  static async getInitialProps(context){
    const path = context.asPath;
    const options = {
      "sort": {
        "poll": -1
      },
      "limit": 0,
      "page": 1,
      "populate": "desc"
  };
    const res = await fetch(`http://localhost:3000/polls?query=${JSON.stringify(options)}`);
    const data = await res.json();
    return { data: data.data, admin: path.indexOf('?admin=true') >= 0}
  }

  async deletePoll(id) {
    const res = await fetch(`http://localhost:3000/polls/${id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if(data._id === id) {
      const list = this.props.data;
      _.remove(list, (li: any, i) => {
        console.log(li)
        return li._id === id;
      });
      this.setState({list})
      alert('delete ok');
    } else {
      alert('delete fail');
    }
  }

  async votePoll(id, poll) {
    const res = await fetch(`http://localhost:3000/polls/${id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        poll
      }),
    });
    const data = await res.json();
    if(data._id === id) {
      const list = this.props.data;
      _.map(list, (li, i) => {
        if(li._id === id) {
          list[i] = {
            ...list[i],
            poll
          }
        }
      });
      this.setState({list});
      alert('vote ok');
    } else {
      alert('vote fail');
    }
  }

  connectWebsocket = () => {
    const socket = new WebSocket('ws://localhost:8080');
    this.socket = socket;
    const that = this;
    socket.onopen = function() {
      console.log('Connected');
      socket.send(
        JSON.stringify({
          event: 'events',
          data: 'init',
        }),
      );
      socket.onmessage = function(res) {
        const data = JSON.parse(res.data);
        if(data.data === 'vote'){
          console.log('vote');
          window.location.reload();
        }
      };
      socket.onclose = () => {
        console.log('not Connected');
      }
    };
  }

  onDeletePoll = (e) => {
    const id = e.target.getAttribute('id');
    this.deletePoll(id);
  }

  onVotePoll = (e) => {
    const id = e.target.getAttribute('id');
    let poll = e.target.getAttribute('value') || 0;
    poll = parseInt(poll) + 1;
    this.votePoll(id, poll);
    this.socket.send(
      JSON.stringify({
        event: 'events',
        data: 'vote',
      }),
    );
  }

  render() {
    const {data, admin} = this.props;
    return (
      <div>
        {
          data && data.length > 0 ? (
            <h1>the polls are: </h1>
          ) : (
            <h1>no poll!</h1>
          )
        }
        <a href="/edit">add a post</a>
        {
          data.map((item, i) => {
            return (
              <Poll 
                key={item._id}
                dataSource={item}
                isAdmin={admin}
                onVote={this.onVotePoll}
                onDelete={this.onDeletePoll}
              ></Poll>
            )
          })
        }
      </div>

    );
  }
}