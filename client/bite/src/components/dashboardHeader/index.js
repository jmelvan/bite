import React from 'react';
import Cookies from 'universal-cookie';
import { Logo, Home, History, Settings, Logout } from '../../resources/icons';
import history from '../../history';
import './style.scss';

const cookies = new Cookies();

class DashboardHeader extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      logoITE: "op1"
    }
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({logoITE: ""});
    }, 200);
  }

  logout(){
    cookies.remove('_sT', {path: '/'});
    cookies.remove('_u', {path: '/'});
    cookies.remove('_r', {path: '/'});
    history.push('/login');
  }

  render(){
    return(
      <div className="header">
        <div className="header__top-part">
          <Logo class="header-logo" classI={["logoI "+ this.state.logoITE]} classT={["logoT "+ this.state.logoITE]} classE={["logoE "+ this.state.logoITE]} />
          <ul>
            <li className="active"><Home class="li-icons"/><label>Home</label></li>
            <li><History class="li-icons" /><label>History</label></li>
            <li><Settings class="li-icons" /><label>Settings</label></li>
            <li><div className="profile-picture" style={{backgroundImage: "url("+require('../../resources/profile.png')+")"}}></div><label>Profile</label></li>
          </ul>
        </div>
        <div className="header__bottom-part">
          <div onClick={() => {this.logout()}}><Logout class="li-icons" /><label>Logout</label></div>
        </div>
      </div>
    )
  }
}

export default DashboardHeader;