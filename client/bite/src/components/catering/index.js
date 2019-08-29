import React from 'react';
import Cookies from 'universal-cookie';
import history from '../../history';
import axios from 'axios';
import DashboardHeader from '../dashboardHeader';
import Orders from '../orders';
import Menus from '../menus';
import Deliverers from '../deliverers';
import openSocket from 'socket.io-client';
import { Router, Route, Link } from 'react-router-dom';
import './style.scss';

const cookies = new Cookies();
const socket = openSocket('http://on-time.cc:3000');

class Catering extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      orders: undefined,
      deliverers: undefined,
      asignDeliverer: false,
      forOrder: undefined
    }
  }

  componentWillMount(){
    var token = cookies.get('_sT');
    if(token == undefined){
      history.push('/login');
    } else {
      axios.get('http://on-time.cc:8000/api/users/current', {headers: {Authorization: "Token "+token}}).then().catch((err) => {
        if(err.response.statusTest === "Unauthorized"){
          history.push('/login');
        }
      });
    }
  }

  componentDidMount(){
    socket.on('connect', () => {
      socket.emit('introduce', cookies.get('_sT'));
      socket.on('initialize', (data) => {
        this.setState({orders: data.orders, deliverers: data.deliverers});
      })
      socket.on('newOrder', (data) => {
        this.setState({orders: data.orders, deliverers: data.deliverers});
      });
      socket.on('orderUpdate', (data) => {
        this.setState({orders: data.orders, deliverers: data.deliverers});
      });
      socket.on('updateStatusSuccess', (data) => {
        console.log(data);
      });
      socket.on('updateDelivererSuccess', (data) => {
        console.log(data);
      });
    });
  }

  updateStatus(id, status){
    socket.emit('updateStatus', {token: cookies.get('_sT'),  _id: id, status: status});
  }

  asignDeliverer(id){
    axios.get('http://on-time.cc:8000/api/users/deliverers', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
      this.setState({
        deliverers: resp.data.deliverers,
        asignDeliverer: true,
        forOrder: id
      });
    });
  }

  updateDeliverer(id, name){
    socket.emit('updateDeliverer', {token: cookies.get('_sT'),  deliverer_id: id, deliverer: name, order: this.state.forOrder});
    this.setState({asignDeliverer: false});
  }

  render(){
    return(
      <div className="dashboard">
        <DashboardHeader />
        <Route path="/catering" 
              exact
              render={() => {
                return <Orders orders={this.state.orders} 
                              asignDelivererState={this.state.asignDeliverer} 
                              exitAsign={() => {this.setState({asignDeliverer: false})}}
                              deliverers={this.state.deliverers}
                              updateStatus={(id, status) => {this.updateStatus(id, status)}}
                              asignDeliverer={(id) => {this.asignDeliverer(id)}}
                              updateDeliverer={(id, name) => {this.updateDeliverer(id, name)}}
                        />
              }} 
        />
        <Route path="/catering/menus"
              render={() => {
                return <Menus />
              }}
        />
        <Route path="/catering/deliverers"
              render={() => {
                return <Deliverers />
              }}
        />
      </div>
    )
  }
}

export default Catering;