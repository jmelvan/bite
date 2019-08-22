import React from 'react';
import Cookies from 'universal-cookie';
import history from '../../history';
import axios from 'axios';
import './style.scss';

const cookies = new Cookies();

class Catering extends React.Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }

  render(){
    return(
      <div className="orders container-own">
        <div className="orders__header">
          <h3>Orders</h3>
        </div>
      </div>
    )
  }
}

export default Catering;