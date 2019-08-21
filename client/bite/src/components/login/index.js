import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import './style.scss';

const cookies = new Cookies();

class Login extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username: "",
      unTop: 5,
      unFont: 16,
      unBorder: "1px solid #8b959e",
      password: "",
      pwTop: 5,
      pwFont: 16,
      pwBorder: "1px solid #8b959e",
      loginButton: "LOGIN",
      loginBG: "#f37421"
    }
  }
  
  componentDidMount(){
    
  }

  inputFocus(input){
    input == "username" ? 
      this.setState({unTop: -12, unFont: 12})
    :
      this.setState({pwTop: -12, pwFont: 12})
  }

  inputBlur(input){
    if(input == "username"){
      return this.state.username == "" ? this.setState({unTop: 5, unFont: 16, unBorder: "1px solid #8b959e"}) : ""
    } else {
      return this.state.password == "" ? this.setState({pwTop: 5, pwFont: 16, pwBorder: "1px solid #8b959e"}) : ""
    }
  }

  login(){
    axios.post("http://localhost:8000/api/users/login", {
      user: {
        username: this.state.username,
        password: this.state.password
      }
    }).then((res) => {
      cookies.set("Authorization", "Token "+res.data.token, {path: "/"})
    }).catch((err) => {
      if (err.response.data.errors.username){
        this.setState({
          username: "",
          unTop: -12,
          unFont: 12,
          unBorder: "2px solid #f37421",
          loginButton: "Username required",
          loginBG: "crimson"
        });
        this.refs.username.focus();
        setTimeout(() => {
          this.setState({loginButton: "LOGIN", loginBG: "#f37421"});
        }, 1500);
      } else if(err.response.data.errors.password){
        this.setState({
          password: "",
          pwTop: -12,
          pwFont: 12,
          pwBorder: "2px solid #f37421",
          loginButton: "Password required",
          loginBG: "crimson"
        });
        this.refs.password.focus();
        setTimeout(() => {
          this.setState({loginButton: "LOGIN", loginBG: "#f37421"});
        }, 1500);
      } else {
        this.setState({
          username: "",
          unTop: 5,
          unFont: 16,
          unBorder: "1px solid #8b959e",
          password: "",
          pwTop: 5,
          pwFont: 16,
          pwBorder: "1px solid #8b959e",
          loginButton: "Invalid username or password",
          loginBG: "crimson"
        });
        this.refs.username.focus();
        setTimeout(() => {
          this.setState({loginButton: "LOGIN", loginBG: "#f37421"});
        }, 1500);
      }
    })
  }

  render(){
    return (
      <div className="login">
        <div className="plate1-holder"></div>
        <div className="plate2-holder"></div>
        <div className="form-wrapper">
          <form>
            <div className="logo-holder">
              <img src={require("../../resources/logo.svg")} />
            </div>
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
              <label style={{fontSize: this.state.pwFont, top: this.state.pwTop}}>Password</label>
              <input type="password"
                  ref="password" 
                  style={{borderBottom: this.state.pwBorder}}
                  onChange={(event) => {this.state.password == "" ? this.setState({password: event.target.value, pwBorder: "2px solid #f37421"}) : this.setState({password: event.target.value})}} 
                  onFocus={() => this.inputFocus("password")} 
                  onBlur={() => this.inputBlur("password")}
                  value={this.state.password}/>
            </div>
            <div className="login-options">
              <div className="remember">
                <label class="container">Remember me
                  <input type="checkbox" />
                  <span class="checkmark"></span>
                </label>
              </div>
              <div className="forgot">
                Forgot password?
              </div>
            </div>
            <button type="button" style={{backgroundColor: this.state.loginBG}} onClick={() => {this.login()}}>{this.state.loginButton}</button>
            <p className="signin">
              New here? <span>Sign up</span>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login;