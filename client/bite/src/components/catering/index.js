import React from 'react';
import Cookies from 'universal-cookie';
import history from '../../history';
import axios from 'axios';
import DashboardHeader from '../dashboardHeader';
import Order from '../order';
import openSocket from 'socket.io-client';
import './style.scss';

const cookies = new Cookies();
const socket = openSocket('http://on-time.cc:3000');

class Catering extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      orders: undefined
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
      socket.on('initialize', (orders) => {
        this.setState({orders: orders});
      })
      socket.on('newOrder', (order) => {
        console.log(order);
      });
      socket.on('updateStatusSuccess', (data) => {
        console.log(data);
      })
    });
  }

  updateStatus(id, status){
    socket.emit('updateStatus', {token: cookies.get('_sT'),  _id: id, status: status});
  }

  render(){
    return(
      <div className="dashboard">
        <DashboardHeader />
        <div className="orders">
          <div className="orders__header">
            <h3>Home</h3>
          </div>
          <div className="orders__content">
            {this.state.orders ? 
              Object.keys(this.state.orders).map((i, order) => {
                return <Order key={i} 
                              food_list={this.state.orders[order].food_list} 
                              status={this.state.orders[order].status} 
                              time={this.state.orders[order].time} 
                              delivery_location={this.state.orders[order].delivery_location}
                              _id={this.state.orders[order]._id}
                              updateStatus={(id, status) => {this.updateStatus(id, status)}}
                        />
              })
              :
              ""
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Catering;