import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Logo } from '../../resources/icons';

const cookies = new Cookies();

class Header extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      token: ""
    }
  }

  checkToken(){
    axios.post("http://on-time.cc:8000/api/users/tokens/login/"+this.state.token, {} ).then((res) => {
      cookies.set("_T", res.data.token);
      this.props.onLogin();
    })
  }

  render() {
    return (
      <div className="main-header">
        <Logo class="logo" />
        <div className="token-handle">
          <input type="text" 
            className="token-input" 
            onChange={(e) => {this.setState({token: e.target.value})}}
            placeholder="Token"/>
          <button onClick={() => {this.checkToken()}}>Submit</button>
        </div>
      </div>
    )
  }
}

export default Header;