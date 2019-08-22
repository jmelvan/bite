import React from 'react';
import Cookies from 'universal-cookie';
import history from '../../history';
import axios from 'axios';
import DashboardHeader from '../dashboardHeader';
import './style.scss';

const cookies = new Cookies();

class Catering extends React.Component {
  constructor(props){
    super(props);

    this.state = {

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

  render(){
    return(
      <div>
        <DashboardHeader />
        <div className="orders container-own">
          <div className="orders__header">
            <h3>Orders</h3>
          </div>
        </div>
      </div>
    )
  }
}

export default Catering;