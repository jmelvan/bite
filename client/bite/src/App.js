import React from 'react';
import axios from 'axios';
import Header from './components/header';
import Cookies from 'universal-cookie';
import pbkdf2 from 'pbkdf2';
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

  order(menu){
    var forsignature = "";
    menu.food_list.map((meal) => {
      forsignature += meal.name + meal.price;
    });
    var req = {
      food: {
        catering_id: menu.catering_id,
        food_list: menu.food_list,
        signature: pbkdf2.pbkdf2Sync(forsignature, "mieY91IQCTkPWHugLv4ZlZORyT1GtsDF", 500, 512, 'sha512').toString("HEX")
      }
    }
    axios.post("http://on-time.cc:8000/api/users/tokens/use/"+cookies.get("_T").token, req, {headers: {Authorization: "Token "+cookies.get('_sT')}} ).then((res) => {
      res.data.success ? alert(res.data.success) : alert(res.data.error);
    });
  }

  render(){

    const { isLogged, menus } = this.state;

    return (
      <div className="App">
        <Header onLogin={() => this.setState({isLogged: true})} onLogout={() => this.setState({isLogged: false})} isLogged={isLogged} />
        <div className="menus-list">
          {menus ? Object.keys(menus).map((i, menu) => {
            return <div className="menu">
                    <div>
                      <h4>{menus[menu].name}</h4>
                      <ul>
                        {Object.keys(menus[menu].food_list).map((i, meal) => {
                          return <li><div>{menus[menu].food_list[meal].name}</div><div>{menus[menu].food_list[meal].price} kn</div></li>
                        })}
                      </ul>
                    </div>
                    <div>
                      <div className="total-price"><div>Total price:</div><div>{menus[menu].price} kn</div></div>
                      {isLogged ? <button onClick={() => this.order(menus[menu])}>Order</button> : <p>Enter token to make order</p>}
                    </div>
                  </div>
          }) : ""}
        </div>
      </div>
    );
  }
}

export default App;
