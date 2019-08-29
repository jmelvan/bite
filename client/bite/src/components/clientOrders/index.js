import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Time, Cutlery, Location, OrderStatus, Add } from '../../resources/icons';
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

  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  geocode(delivery_location){
    return Geocode.fromLatLng(delivery_location.lat, delivery_location.lng).then(
      response => {
        const address = response.results[0].formatted_address;
        return address.substr(0, address.indexOf(','));
      },
      error => {
        console.error(error);
      }
    );
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
              return <div className="client-order">
                      <div>
                        <h4>2.8.2019<span className={this.state.orders[order].status}>{this.Capitalize(this.state.orders[order].status)}</span></h4>
                        <div className="location"><Location /> {this.geocode(this.state.orders[order].delivery_location)}</div>
                        <ul>
                          <li><div>Lazagne</div><div>95 kn</div></li>
                          <li><div>Pizza</div><div>75 kn</div></li>
                          <li><div>Salad</div><div>25 kn</div></li>
                        </ul>
                      </div>
                      <div className="total-price"><div>Total price:</div><div>200 kn</div></div>
                    </div>
            })
          : ""
          }
        </div>
      </div>
    )
  }
}

export default ClientOrders;