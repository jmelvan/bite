import React from 'react';
import history from '../../history';
import { Time, Cutlery, Location, OrderStatus, Add } from '../../resources/icons';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI");

const Pulse = () => <div className="pulse"></div>;

class Order extends React.Component {
  static defaultProps = {
    center: {
      lat: 43.552605,
      lng: 16.346971
    },
    zoom: 13
  };
  constructor(props){
    super(props);
    this.food = React.createRef();
    this.state = {
      height: 0,
      left: 0,
      top: 0,
      opacity: 1,
      aniamteList: false,
      change: false,
      streetName: undefined,
      confirm: "",
    }
  }

  _handleAnim(){
    if(this.state.height == 0){
      this.setState({
        height: 300,
        left: this.food.current.offsetWidth,
        top: (this.food.current.offsetHeight/2)-11,
        change: true,
        loadmap: true
      })
      setTimeout(() => {
        this.setState({
          left: 11,
          top: 130,
        });
      }, 100);
      setTimeout(() => {
        this.setState({
          aniamteList: true
        })
      }, 250);
      setTimeout(() => {
        this.setState({
          opacity: 0
        });
      }, 350);
      setTimeout(() => {
        this.setState({
          loadmap: false
        });
      }, 850);
    } else {
      this.setState({
        height: 0,
        left: 0,
        top: 0,
        opacity: 1,
        aniamteList: false,
        change: false
      });
    }
  }

  componentDidMount(){
    Geocode.fromLatLng(this.props.delivery_location.lat, this.props.delivery_location.lng).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({
          streetName: address.substr(0, address.indexOf(','))
        }) 
      },
      error => {
        console.error(error);
      }
    );
  }

  renderTime(time){
    var now = new Date();
    var than = new Date(time);
    var date = new Date(now.getTime() - than.getTime());
    if(date.getDay() > 4){
      return date.getDay() - 4 + (date.getDay() > 5 ? " days ago" : " day ago");
    } else if(date.getHours() > 1){
      return date.getHours() + " hrs ago";
    } else {
      return date.getMinutes() + " min ago";
    }
  }

  mealInsight(food_list){
    var data = "";
    Object.keys(food_list).slice(0, 2).map((i, meal) => {
      data += food_list[meal].name + (meal != 1 ? ", " : "...");
    });
    return data;
  }

  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render(){
    return (
      <div className="order">
        <div className="order__minimal">
          <div className="order-deliverer">
            {this.props.deliverer ? <div className="profile-picture" style={{backgroundImage: "url("+require('../../resources/profile.png')+")"}}></div> : ""}
            {this.props.deliverer ? this.props.deliverer : <button onClick={() => {this.props.asignDeliverer(this.props._id)}}><Add /> Add deliverer</button>}
          </div>
          <div className="order-time" onClick={() => {this._handleAnim()}}>
            <Time class="order-icons" />
            {this.renderTime(this.props.time)}
          </div>
          <div className="order-food hide-900" ref={this.food} onClick={() => {this._handleAnim()}}>
            <div style={this.state.change ? {left: this.state.left*2-1, top: this.state.top, width: this.state.left > 100 ? this.state.left+2 : "100", opacity: this.state.opacity, position: "absolute", maxWidth: "unset"} : {}}>
              <Cutlery class="order-icons" />
              {this.mealInsight(this.props.food_list)}
            </div>
          </div>
          <div className="order-location hide-1100" onClick={() => {this._handleAnim()}}>
            <div style={this.state.change ? {right: this.state.left, top: this.state.top, width: this.state.left > 100 ? this.state.left : "100", opacity: this.state.opacity, position: "absolute"} : {}}>
              <Location class="order-icons" />
              <span>{this.state.streetName}</span>
            </div>
          </div>
          <div className="order-status hide-600">
            <div className={"status-badge "+this.props.status+" "+this.state.confirm} 
                onMouseEnter={() => this.props.status == "pending" ? this.setState({confirm: "confirm"}) : this.props.status == "confirmed" ? this.setState({confirm: "ready"}) : ""}
                onMouseLeave={() => this.props.status == "pending" ? this.setState({confirm: ""}) : this.props.status == "confirmed" ? this.setState({confirm: ""}) : ""}
                onClick={() => this.props.status == "pending" ? this.props.updateStatus(this.props._id, "confirmed") : this.props.status == "confirmed" ? this.props.updateStatus(this.props._id, "ready") : ""}
            >
              <OrderStatus class={"status-badge-icon "+this.props.status+" "+this.state.confirm} />
              {this.state.confirm == "confirm" ? "Confirm" : this.state.confirm == "ready" ? "Ready" : this.Capitalize(this.props.status)}
            </div>
          </div>
        </div>
        <div className="order__full" style={{height: this.state.height}}>
          <div className="full_location">
            <div className="full_foodlist" style={{height: this.state.aniamteList ? "calc(100% - 90px)" : 0, opacity: this.state.aniamteList ? 1 : 0}}>
              <h3 style={this.state.change ? {opacity: this.state.opacity == 0 ? 1 : 0} : {}}><Cutlery class="order-icons" />Food list</h3>
              <ul style={this.state.change ? {display: this.state.opacity == 0 ? "block" : "none"} : {}}>
                {Object.keys(this.props.food_list).map((i, meal) => {
                  return <li>{this.props.food_list[meal].name}</li>
                })}
              </ul>
            </div>
            <div className="maploader" style={{display: this.state.loadmap ? "block" : ""}}></div>
            <GoogleMapReact
              bootstrapURLKeys={{ key: "AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI" }}
              defaultCenter={{lat: this.props.delivery_location.lat, lng: this.props.delivery_location.lng}}
              defaultZoom={this.props.zoom}
              yesIWantToUseGoogleMapApiInternals
              options={{fullscreenControl: false, disableDefaultUI: true}}
              style={{position: "absolute", width: "100%", height: "110%"}}
            >
              <Pulse
                lat={this.props.delivery_location.lat}
                lng={this.props.delivery_location.lng}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    )
  }
}

export default Order;