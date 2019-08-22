import React from 'react';
import { Logo } from '../../resources/icons';
import './style.scss';

class DashboardHeader extends React.Component {

  render(){
    return(
      <div className="header">
        <Logo class="logo" />
        <div className="header__right-part">
          <ul>
            <li className="active">Dashboard</li>
            <li>Orders history</li>
            <li>Logout</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default DashboardHeader;