import React from 'react';
import axios from 'axios';
import Header from './components/header';
import Cookies from 'universal-cookie';
import './style.scss';

const cookies = new Cookies();

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      isLogged: false,
      menus: undefined
    }
  }

  componentDidMount(){
    if(cookies.get("_T") != undefined){
      this.setState({isLogged: true})
    }
    axios.get('http://on-time.cc:8000/api/users/food/menus-all').then((resp) => {
      this.setState({menus: resp.data.menus});
      console.log(resp.data.menus);
    });
  }

  login(){
    this.setState({isLogged: true});
  }

  render(){

    const { isLogged } = this.state;

    return (
      <div className="App">
        <Header onLogin={() => {this.login()}} />
        <div className="menus-list">

          <div className="menu">
            <div>
              <h4>Pizza menu</h4>
              <ul>
                <li><div>Pizza</div><div>75 kn</div></li>
                <li><div>Salad</div><div>25 kn</div></li>
                <li><div>Lazagne</div><div>95 kn</div></li>
              </ul>
            </div>
            <div>
              <div className="total-price"><div>Total price:</div><div>200 kn</div></div>
              {isLogged ? <button>Order</button> : <p>Enter token to make order</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
