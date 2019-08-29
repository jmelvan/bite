import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Token from '../token';
import { Time, Location, Add } from '../../resources/icons';
import Autocomplete from 'react-google-autocomplete';
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI");
const cookies = new Cookies();

const Pulse = () => <div className="pulse"></div>;

class Tokens extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      tokens: undefined,
      addToken: false,
      editToken: false,
      editTokenId: undefined,
      username: "",
      unTop: 5,
      unFont: 16,
      password: "",
      pwTop: 5,
      pwFont: 16,
      displayName: "",
      emTop: 5,
      clickedAdd: 0,
      emFont: 16,
      lat: undefined,
      lng: undefined,
      mapLoaded: false,
      zoom: 14,
      returnValue: undefined
    }
  }
  
  componentDidMount(){
    this.fetchTokens();
  }

  fetchTokens(){
    axios.get('http://on-time.cc:8000/api/users/tokens', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
      this.setState({tokens: resp.data.tokens});
    });
  }

  stateNormal(){
    this.setState({
      addToken: false,
      username: "",
      unTop: 5,
      unFont: 16,
      password: "",
      pwTop: 5,
      pwFont: 16,
      displayName: "",
      emTop: 5,
      clickedAdd: 0,
      mapLoaded: false,
      emFont: 16,
      returnValue: undefined
    });
  }

  addToken(){
    this.setState({addToken: true});
  }

  exitAdd(){
    if(this.state.editToken){ 
      this.setState({
        editToken: false,
        editTokenId: undefined
      })
      this.stateNormal()
    } else {
      this.setState({
        addToken: false,
        mapLoaded: false,
        lat: undefined,
        lng: undefined,
        returnValue: undefined
      })
    }
  }

  inputFocus(input){
    if(input == "username"){
      this.setState({unTop: -12, unFont: 12})
    } else if(input == "email"){
      this.setState({emTop: -12, emFont: 12})
    } else if(input == "password"){
      this.setState({pwTop: -12, pwFont: 12})
    }
  }

  inputBlur(input){
    if(input == "username"){
      return this.state.username == "" ? this.setState({unTop: 5, unFont: 16}) : ""
    } else if(input == "email"){
      return this.state.displayName == "" ? this.setState({emTop: 5, emFont: 16}) : ""
    } else if(input == "password"){
      return this.state.password == "" ? this.setState({pwTop: 5, pwFont: 16}) : ""
    }
  }

  tokenLocation(place){
    Geocode.fromAddress(place.formatted_address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({lat: lat, lng: lng});
      },
      error => {
        console.error(error);
      }
    );
    console.log(place);
    this.setState({
      returnValue: place.address_components[0].long_name + ", " + place.address_components[1].long_name + ", " + place.address_components[4].long_name
    })
  }

  render(){
    return(
      <div className="orders">
        <div className="orders__header">
          <h3>Tokens</h3>
          <button onClick={() => {this.addToken()}}><Add /> Create token</button>
        </div>
        <div className="client-orders__content">
          {this.state.tokens ?
            Object.keys(this.state.tokens).map((i, token) => {
              return <Token 
                        token={this.state.tokens[token].token}
                        delivery_location={this.state.tokens[token].delivery_location}
                        allowed_uses={this.state.tokens[token].allowed_uses}
                        number_of_uses={this.state.tokens[token].number_of_uses}
                        total_price={this.state.tokens[token].total_price}
                        max_price={this.state.tokens[token].max_price}
                      />
            })
          : ""
          }
        </div>
        <div className="asign-wrapper" style={{display: this.state.addToken ? "flex" : "none"}}>
          <div className="exit-asign" onClick={() => {this.exitAdd()}}></div>
          <div className="create-menu">
            <h3>{this.state.editToken ? "Edit token" : "Create token"}</h3>
            <form>
              <div className="input-group">
                <label style={{fontSize: this.state.unFont, top: this.state.unTop}}>Allowed uses</label>
                <input type="text" 
                    onChange={(event) => {this.state.username == "" ? this.setState({username: event.target.value}) : this.setState({username: event.target.value})}} 
                    onFocus={() => this.inputFocus("username")} 
                    onBlur={() => this.inputBlur("username")}
                    value={this.state.username}/>
              </div>
              <div className="input-group">
                <label style={{fontSize: this.state.emFont, top: this.state.emTop}}>Max price</label>
                <input type="text" 
                    onChange={(event) => {this.setState({displayName: event.target.value})}} 
                    onFocus={() => this.inputFocus("email")} 
                    onBlur={() => this.inputBlur("email")}
                    value={this.state.displayName}/>
              </div>
              <Autocomplete
                className="autocomplete"
                onPlaceSelected={(place) => {
                  this.tokenLocation(place);
                }}
                onChange={(e) => {this.setState({returnValue: e.target.value})}}
                types={['address']}
                placeholder="Location"
                value={this.state.returnValue ? this.state.returnValue : ""}
              />
              {this.state.lat ?
                <div className="map-autocomplete" style={{height: this.state.mapLoaded ? "300px" : "0px"}}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyBLkw5VIa8xHG0uvzk_pARR9mLDLjqYKnI" }}
                    center={{lat: this.state.lat, lng: this.state.lng}}
                    defaultZoom={this.state.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    options={{fullscreenControl: false, disableDefaultUI: true}}
                    style={{position: "absolute", width: "100%", height: "110%"}}
                    onGoogleApiLoaded={() => {this.setState({mapLoaded: true})}}
                  >
                    <Pulse
                      lat={this.state.lat}
                      lng={this.state.lng}
                    />
                  </GoogleMapReact>
                </div>
              : ""}
              {!this.state.editDeliverer ?
                <button type="button" onClick={() => {this.createToken()}}><Add /> Create token</button>
                :
                <div className="editingMenu"><div onClick={() => {this.deleteToken()}}>Delete token</div><button type="button" onClick={() => {this.updateToken()}}><Add /> Update token</button></div>
              }
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Tokens;