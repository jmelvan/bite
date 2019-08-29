import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Time, Cutlery, Location, OrderStatus, Add } from '../../resources/icons';
import '../catering/style.scss';
import '../client/style.scss';

const cookies = new Cookies();

class ClientOrders extends React.Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }

  componentWillMount(){
    this.fetchOrders();
  }

  fetchOrders(){
    axios.get('http://on-time.cc:8000/api/users/orders', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
      console.log(resp.data.orders);
      this.setState({orders: resp.data.orders});
    });
  }

  render(){
    return(
      <div className="orders">
        <div className="orders__header">
          <h3>Home</h3>
        </div>
        <div className="client-orders__content">
          <div className="client-order">
            <div>
              <h4>2.8.2019<span className="ready">Ready</span></h4>
              <div className="location"><Location /> Marmontova ul.</div>
              <ul>
                <li><div>Lazagne</div><div>95 kn</div></li>
                <li><div>Pizza</div><div>75 kn</div></li>
                <li><div>Salad</div><div>25 kn</div></li>
              </ul>
            </div>
            <div className="total-price"><div>Total price:</div><div>200 kn</div></div>
          </div>
          <div className="client-order">
            <div>
              <h4>1.8.2019<span className="delivered">Delivered</span></h4>
              <div className="location"><Location /> Marmontova ul.</div>
              <ul>
                <li><div>Pizza</div><div>75 kn</div></li>
                <li><div>Salad</div><div>25 kn</div></li>
              </ul>
            </div>
            <div className="total-price"><div>Total price:</div><div>100 kn</div></div>
          </div>
        </div>
      </div>
    )
  }
}

export default ClientOrders;