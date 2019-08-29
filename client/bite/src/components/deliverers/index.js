import React from 'react';
import { Add } from '../../resources/icons';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../catering/style.scss';

const cookies = new Cookies();

class Deliverers extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      deliverers: undefined,
      addDeliverer: false,
      editDeliverer: false,
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
    }
  }

  componentDidMount(){
    this.fetchDeliverers();
  }

  fetchDeliverers(){
    axios.get('http://on-time.cc:8000/api/users/deliverers', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
      this.setState({deliverers: resp.data.deliverers});
    });
  }

  stateNormal(){
    this.setState({
      addDeliverer: false,
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
    });
  }

  addDeliverer(){
    this.setState({addDeliverer: true})
  }

  exitAdd(){
    if(this.state.editDeliverer){ 
      this.setState({
        editDeliverer: false,
        editDelivererId: undefined
      })
      this.stateNormal()
    } else {
      this.setState({
        addDeliverer: false
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

  createDeliverer(){
    if(this.state.clickedAdd === 0){
      this.setState({clickedAdd: 0});
      axios.post("http://on-time.cc:8000/api/users/deliverers/add", {
        user: {
          username: this.state.username,
          password: this.state.password,
          name: this.state.displayName,
          role: "deliverer"
        }
      }, {headers: {Authorization: "Token "+cookies.get('_sT')}} ).then(() => {
        this.stateNormal();
        this.fetchDeliverers();
      })
    }
  }

  editDeliverer(deliverer){
    this.setState({
      displayName: deliverer.name,
      username: deliverer.username,
      addDeliverer: true,
      editDeliverer: true,
      editDelivererId: deliverer._id
    });
    this.inputFocus("username");
    this.inputFocus("email");
  }

  updateDeliverer(){
    
  }

  render(){
    return(
      <div className="orders">
        <div className="orders__header">
          <h3>Deliverers</h3>
          <button onClick={() => {this.addDeliverer()}}><Add /> Add deliverer</button>
        </div>
        <div className="menus__content">
          {this.state.deliverers ?
            Object.keys(this.state.deliverers).map((i, deliverer) => {
              return <div className="deliverer-profile" onClick={() => {this.editDeliverer(this.state.deliverers[deliverer])}}>
                      <div className="deliverer-profile-picture"><div></div></div>
                      <h4>{this.state.deliverers[deliverer].name}</h4>
                    </div>
            })
          : ""
          }
        </div>
        <div className="asign-wrapper" style={{display: this.state.addDeliverer ? "flex" : "none"}}>
          <div className="exit-asign" onClick={() => {this.exitAdd()}}></div>
          <div className="create-menu">
            <h3>{this.state.editDeliverer ? "Edit deliverer" : "Add deliverer"}</h3>
            <form>
              <div className="input-group">
                <label style={{fontSize: this.state.unFont, top: this.state.unTop}}>Username</label>
                <input type="text" 
                    onChange={(event) => {this.state.username == "" ? this.setState({username: event.target.value}) : this.setState({username: event.target.value})}} 
                    onFocus={() => this.inputFocus("username")} 
                    onBlur={() => this.inputBlur("username")}
                    value={this.state.username}/>
              </div>
              <div className="input-group">
                <label style={{fontSize: this.state.emFont, top: this.state.emTop}}>Display name</label>
                <input type="text" 
                    onChange={(event) => {this.setState({displayName: event.target.value})}} 
                    onFocus={() => this.inputFocus("email")} 
                    onBlur={() => this.inputBlur("email")}
                    value={this.state.displayName}/>
              </div>
              <div className="input-group">
                <label style={{fontSize: this.state.pwFont, top: this.state.pwTop}}>{this.state.editDeliverer ? "New passoword" : "Password"}</label>
                <input type="password" 
                    onChange={(event) => {this.setState({password: event.target.value})}} 
                    onFocus={() => this.inputFocus("password")} 
                    onBlur={() => this.inputBlur("password")}
                    value={this.state.password}/>
              </div>
              {!this.state.editDeliverer ?
                <button type="button" onClick={() => {this.createDeliverer()}}><Add /> Add deliverer</button>
                :
                <div className="editingMenu"><div onClick={() => {this.deleteDeliverer()}}>Delete deliverer</div><button type="button" onClick={() => {this.updateDeliverer()}}><Add /> Update deliverer</button></div>
              }
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Deliverers;