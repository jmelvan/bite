import React from 'react';
import { Location } from '../../resources/icons';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI");

class Token extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      location: undefined,
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
  }

  render(){
    return(
      <div className="token" onClick={() => {this.props.onClick(this.props.tokenFull)}}>
        <div>
          <h4>{this.props.token}</h4>
          <div><Location class="order-icons" />{this.state.location}</div>
        </div>
        <div>
          {this.props.allowed_uses != undefined ? <div><div>Allowed uses:</div><div>{this.props.allowed_uses}x</div></div> : ""}
          {this.props.max_price != undefined ? <div><div>Money amount:</div><div>{this.props.max_price} kn</div></div> : ""}
          {this.props.total_price != undefined ? <div><div>Money spent:</div><div>{this.props.total_price} kn</div></div> : ""}
          <div><div>Number of uses:</div><div>{this.props.number_of_uses ? this.props.number_of_uses : "0"}x</div></div>
        </div>
      </div>
    )
  }
}

export default Token;