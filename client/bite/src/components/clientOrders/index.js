import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../catering/style.scss';
import '../client/style.scss';

const cookies = new Cookies();

class ClientOrders extends React.Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }

  componentWillMount(){
    this.fetchOrders();
  }

  fetchOrders(){
    axios.get('http://on-time.cc:8000/api/users/orders', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
      console.log(resp.data.orders);
      this.setState({orders: resp.data.orders});
    });
  }

  render(){
    return(
      <div className="orders">
        <div className="orders__header">
          <h3>Home</h3>
        </div>
        <div className="orders__content">

        </div>
      </div>
    )
  }
}

export default ClientOrders;