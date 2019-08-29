import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Time, Cutlery, Location, OrderStatus, Add } from '../../resources/icons';
import ClientOrder from '../clientOrder';
import '../catering/style.scss';
import '../client/style.scss';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI");
const cookies = new Cookies();

class ClientOrders extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      orders: undefined
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
        <div className="client-orders__content">
          {this.state.orders ?
            Object.keys(this.state.orders).map((i, order) => {
              return <ClientOrder 
                        delivery_location={this.state.orders[order].delivery_location}
                        status={this.state.orders[order].status}
                        food_list={this.state.orders[order].food_list}
                        price={this.state.orders[order].price}
                        time={this.state.orders[order].time}
                      />
            })
          : ""
          }
        </div>
      </div>
    )
  }
}

export default ClientOrders;