import React from 'react';
import { Logo } from '../../resources/icons';

class DashboardHeaderMob extends React.Component {

  render(){
    return(
      <div className="header-mob">
         <Logo class="header-mob-logo"/>
         <img src={require("../../resources/hamburger.svg")} onClick={() => {this.props.openMenu()}}/>
      </div>
    )
  }
}

export default DashboardHeaderMob;