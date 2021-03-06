import React from 'react';
import Cookies from 'universal-cookie';
import history from '../../history';
import axios from 'axios';
import DashboardHeader from '../dashboardHeader';
import DashboardHeaderMob from '../dashboardHeaderMob';
import ClientOrders from '../clientOrders';
import Tokens from '../tokens';
import { Router, Route, Link } from 'react-router-dom';
import './style.scss';

const cookies = new Cookies();

class Client extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      openMenu: false
    }
  }

  componentWillMount(){
    var token = cookies.get('_sT');
    if(token == undefined || cookies.get('_r') != "client"){
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
        <Route path="/client" 
              exact
              render={() => {
                return <ClientOrders />
              }} 
        />
        <Route path="/client/tokens" 
              render={() => {
                return <Tokens />
              }} 
        />
      </div>
    )
  }
}

export default Client;
