import React from 'react';
import Cookies from 'universal-cookie';
import { Logo } from '../../resources/icons';
import history from '../../history';
import './style.scss';

const cookies = new Cookies();

class DashboardHeader extends React.Component {

  logout(){
    cookies.remove('_sT', {path: '/'});
    cookies.remove('_u', {path: '/'});
    cookies.remove('_r', {path: '/'});
    history.push('/login');
  }

  render(){
    return(
      <div className="header">
        <Logo class="logo" />
        <div className="header__right-part">
          <ul>
            <li className="active">Dashboard</li>
            <li>Orders history</li>
            <li onClick={() => {this.logout()}}>Logout</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default DashboardHeader;