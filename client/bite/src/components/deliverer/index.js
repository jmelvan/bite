import React from 'react';
import Cookies from 'universal-cookie';
import DashboardHeader from '../dashboardHeader';
import DashboardHeaderMob from '../dashboardHeaderMob';
import Orders from '../orders';
import history from '../../history';
import axios from 'axios';
import { Router, Route, Link } from 'react-router-dom';
import './style.scss';

const cookies = new Cookies();

class Catering extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      orders: undefined,
    }
  }

  componentWillMount(){
    var token = cookies.get('_sT');
    if(token == undefined || cookies.get('_r') != "deliverer"){
      history.push('/login');
    } else {
      axios.get('http://on-time.cc:8000/api/users/current', {headers: {Authorization: "Token "+token}}).then().catch((err) => {
        if(err.response.statusTest === "Unauthorized"){
          history.push('/login');
        }
      });
    }
  }

  render(){
    return(
      <div className="dashboard">
        <DashboardHeader openMenu={this.state.openMenu} closeMenu={() => {this.setState({openMenu: false})}}/>
        {window.innerWidth <= 767 ? <DashboardHeaderMob openMenu={() => {this.setState({openMenu: true})}}/> : ""}
        <Route path="/deliverer" 
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
      </div>
    )
  }
}

export default Catering;