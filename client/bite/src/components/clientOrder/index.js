import React from 'react';
import { Location } from '../../resources/icons';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI");

class ClientOrder extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      location: undefined,
      date: undefined
    }
  }
  
  componentDidMount(){
    Geocode.fromLatLng(this.props.delivery_location.lat, this.props.delivery_location.lng).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({location: address.substr(0, address.indexOf(','))});
      },
      error => {
        console.error(error);
      }
    );
    var date = new Date(this.props.time);
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    this.setState({date: day + "." + month + "." + year});
  }

  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render(){
    return(
      <div className="client-order">
        <div>
          <h4>{this.state.date}<span className={this.props.status}>{this.Capitalize(this.props.status)}</span></h4>
          <div className="location"><Location /> {this.state.location}</div>
          <ul>
            {this.props.food_list.map((meal, i) => {
              return <li><div>{meal.name}</div><div>{meal.price} kn</div></li>
            })}
          </ul>
        </div>
        <div className="total-price"><div>Total price:</div><div>{this.props.price} kn</div></div>
      </div>
    )
  }
}

export default ClientOrder;