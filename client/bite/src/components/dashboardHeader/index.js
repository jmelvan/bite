import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Logo, Home, Menus, Deliverers, Logout } from '../../resources/icons';
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
      <div className="header-wrapper" style={{display: window.innerWidth <= 767 ? this.props.openMenu ? "flex" : "none" : ""}}>
        <div className="header">
          <div className="header__top-part">
            <Logo class="header-logo" classI={["logoI "+ this.state.logoITE]} classT={["logoT "+ this.state.logoITE]} classE={["logoE "+ this.state.logoITE]} />
            <Route path="/catering" render={() => {
              return <ul>
                        <NavLink exact={true} to="/catering"><li className={window.location.pathname == "/catering" ? "active" : ""}><Home class="li-icons"/><label>Home</label></li></NavLink>
                        <NavLink to="/catering/menus"><li><Menus class="li-icons" /><label>Menus</label></li></NavLink>
                        <NavLink to="/catering/deliverers"><li><Deliverers class="li-icons" /><label>Deliverers</label></li></NavLink>
                        <li><div className="profile-picture" style={{backgroundImage: "url("+require('../../resources/profile.png')+")"}}></div><label>Profile</label></li>
                      </ul>
            }} />
            <Route path="/client" render={() => {
              return <ul>
                        <NavLink exact={true} to="/client"><li className={window.location.pathname == "/client" ? "active" : ""}><Home class="li-icons"/><label>Home</label></li></NavLink>
                        <NavLink to="/client/tokens"><li><Menus class="li-icons" /><label>Tokens</label></li></NavLink>
                        <li><div className="profile-picture" style={{backgroundImage: "url("+require('../../resources/profile.png')+")"}}></div><label>Profile</label></li>
                      </ul>
            }} />
            <Route path="/deliverer" render={() => {
              return <ul>
                        <NavLink exact={true} to="/deliverer"><li className={window.location.pathname == "/deliverer" ? "active" : ""}><Home class="li-icons"/><label>Orders</label></li></NavLink>
                        <NavLink to="/deliverer/navigation"><li><Menus class="li-icons" /><label>Navigation</label></li></NavLink>
                        <li><div className="profile-picture" style={{backgroundImage: "url("+require('../../resources/profile.png')+")"}}></div><label>Profile</label></li>
                      </ul>
            }} />
          </div>
          <div className="header__bottom-part">
            <div onClick={() => {this.logout()}}><Logout class="li-icons" /><label>Logout</label></div>
          </div>
        </div>
        <div className="exit-mob-extended" onClick={() => {this.props.closeMenu()}}></div>
      </div>
    )
  }
}

export default DashboardHeader;