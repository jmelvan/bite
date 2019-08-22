import React from 'react';
import Cookies from 'universal-cookie';
import history from '../../history';
import axios from 'axios';
import { Logo } from '../../resources/icons';
import '../login/style.scss';

const cookies = new Cookies();

class Login extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username: "",
      unTop: 5,
      unFont: 16,
      unBorder: "1px solid #8b959e",
      email: "",
      emTop: 5,
      emFont: 16,
      emBorder: "1px solid #8b959e",
      password: "",
      pwTop: 5,
      pwFont: 16,
      pwBorder: "1px solid #8b959e",
      loginButton: "Sign up",
      loginBG: "#f37421",
      role: "catering"
    }
  }
  
  componentDidMount(){
    
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
      return this.state.username == "" ? this.setState({unTop: 5, unFont: 16, unBorder: "1px solid #8b959e"}) : ""
    } else if(input == "email"){
      return this.state.email == "" ? this.setState({emTop: 5, emFont: 16, emBorder: "1px solid #8b959e"}) : ""
    } else if(input == "password"){
      return this.state.password == "" ? this.setState({pwTop: 5, pwFont: 16, pwBorder: "1px solid #8b959e"}) : ""
    }
  }

  signin(){
    if(this.state.username != "" && this.state.email != "" && this.state.password != ""){
      axios.post('http://on-time.cc:8000/api/users', {
        user: {
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
          role: this.state.role
        }
      }).then((res) => {
        cookies.set("_sT", res.data.user.token, {path: "/"});
        cookies.set("_u", res.data.user._id, {path: "/"});
        cookies.set("_r", res.data.user.role, {path: "/"});
        this.props.history.push("/"+this.state.role);
      }).catch((err) => {
        this.setState({
          loginButton: err.response.data.error,
          loginBG: "crimson"
        });
        setTimeout(() => {
          this.setState({loginButton: "Sign up", loginBG: "#f37421"});
        }, 1500);
      });
    } else {
      this.setState({
        loginButton: "Please fill all fields",
        loginBG: "crimson"
      });
      setTimeout(() => {
        this.setState({loginButton: "Sign up", loginBG: "#f37421"});
      }, 1500);
    }
  }

  render(){
    return (
      <div className="login">
        <div className="plate1-holder join"></div>
        <div className="plate2-holder join"></div>
        <div className="logo-holder">
          <Logo class="logo join" />
          <img className="hamburger" src={require("../../resources/hamburger.svg")} />
        </div>
        <div className="form-wrapper">
          <form>
            <div className="input-group">
              <label style={{fontSize: this.state.unFont, top: this.state.unTop}}>Username</label>
              <input type="text" 
                  ref="username"
                  style={{borderBottom: this.state.unBorder}}
                  onChange={(event) => {this.state.username == "" ? this.setState({username: event.target.value, unBorder: "2px solid #f37421"}) : this.setState({username: event.target.value})}} 
                  onFocus={() => this.inputFocus("username")} 
                  onBlur={() => this.inputBlur("username")}
                  value={this.state.username}/>
            </div>
            <div className="input-group">
              <label style={{fontSize: this.state.emFont, top: this.state.emTop}}>Email</label>
              <input type="email"
                  ref="email" 
                  style={{borderBottom: this.state.emBorder}}
                  onKeyDown={(e) => e.key === "Enter" ? this.signin() : ""}
                  onChange={(event) => {this.state.email == "" ? this.setState({email: event.target.value, emBorder: "2px solid #f37421"}) : this.setState({email: event.target.value})}} 
                  onFocus={() => this.inputFocus("email")} 
                  onBlur={() => this.inputBlur("email")}
                  value={this.state.email}/>
            </div>
            <div className="input-group">
              <label style={{fontSize: this.state.pwFont, top: this.state.pwTop}}>Password</label>
              <input type="password"
                  ref="password" 
                  style={{borderBottom: this.state.pwBorder}}
                  onKeyDown={(e) => e.key === "Enter" ? this.signin() : ""}
                  onChange={(event) => {this.state.password == "" ? this.setState({password: event.target.value, pwBorder: "2px solid #f37421"}) : this.setState({password: event.target.value})}} 
                  onFocus={() => this.inputFocus("password")} 
                  onBlur={() => this.inputBlur("password")}
                  value={this.state.password}/>
            </div>
            <div className="signin-options">
              <button type="button" onClick={() => this.setState({role: "catering"})} className={this.state.role == "catering" ? "active" : ""}>Catering</button>
              <button type="button" onClick={() => this.setState({role: "client"})} className={this.state.role == "client" ? "active" : ""}>Client</button>
            </div>
            <button type="button" style={{backgroundColor: this.state.loginBG}} onClick={() => {this.signin()}}>{this.state.loginButton}</button>
            <p className="signin">
              Already have account? <span onClick={() => {history.push("/login")}}>Log in</span>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login;