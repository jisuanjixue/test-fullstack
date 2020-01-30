import React, {Component} from 'react';
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import Layout from '../components/layout';
import { Poll } from '../components/poll';
import _ from 'lodash';
import io from 'socket.io-client';

export default class extends Component {
  props: { 
    data: any;
    admin: boolean;
  };

  state = {
    list: [],
    user: null
  }

  socket: any

  componentDidMount() {
    this.connectWebsocket();
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
        return li._id === id;
      });
      this.setState({list}, () => {
        this.socket.send(
          JSON.stringify({
            event: 'events',
            data: 'vote',
          }),
        );
      })
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
      this.setState({list}, () => {
        this.socket.send(
          JSON.stringify({
            event: 'events',
            data: 'vote',
          }),
        );
      });
    } else {
      alert('vote fail');
    }
  }

  connectWebsocket = () => {
    const socket = new WebSocket('ws://localhost:8080');
    this.socket = socket;
    const that = this;
    
    socket.onopen = function() {
      socket.send(
        JSON.stringify({
          event: 'events',
          data: 'init',
        }),
      );
      socket.onmessage = function(res) {
        const data = JSON.parse(res.data);
        if(data.data === 'vote'){
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
    
    
  }

  render() {
    const {data, admin} = this.props;
    return (
      <Layout>
          <p>
            <Link href="/edit"><span>add a post</span></Link>
          </p>
          {
            data && data.length > 0 ? data.map((item, i) => {
              return (
                <Poll 
                  key={item._id}
                  dataSource={item}
                  isAdmin={admin}
                  onVote={this.onVotePoll}
                  onDelete={this.onDeletePoll}
                ></Poll>
              )
            }) : (
              <p>no data, you could add one</p>
            )
          }
        </Layout>
    );
  }
}