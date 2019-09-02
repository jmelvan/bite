import React from 'react';
import { Add } from '../../resources/icons';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../catering/style.scss';

const cookies = new Cookies();

class Menus extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      menus: undefined,
      addMenu: false,
      editMenu: false,
      name: "",
      unTop: 5,
      unFont: 16,
      listItem: "",
      pwTop: 5,
      pwFont: 16,
      totalPrice: "",
      emTop: 5,
      emFont: 16,
      list: [],
      clickedAdd: 0,
      searchList: undefined
    }
  }

  componentDidMount(){
    var token = cookies.get('_sT');
    axios.get('http://on-time.cc:8000/api/users/food/menus', {headers: {Authorization: "Token "+token}}).then((resp) => {
      this.setState({menus: resp.data.menus});
    });
  }

  inputFocus(input){
    if(input == "username"){
      this.setState({unTop: -12, unFont: 12})
    } else if(input == "email"){
      this.setState({emTop: -12, emFont: 12})
    } else if(input == "password"){
      this.setState({pwTop: -12, pwFont: 12})
    }
  }

  inputBlur(input){
    if(input == "username"){
      return this.state.name == "" ? this.setState({unTop: 5, unFont: 16}) : ""
    } else if(input == "email"){
      return this.state.totalPrice == "" ? this.setState({emTop: 5, emFont: 16}) : ""
    } else if(input == "password"){
      return this.state.listItem == "" ? this.setState({pwTop: 5, pwFont: 16}) : ""
    }
  }

  addMenu(){
    this.setState({
      addMenu: true
    })
  }

  exitAdd(){
    if(this.state.editMenu){ 
      this.setState({
        editMenu: false,
        editMenuId: undefined
      })
      this.stateNormal()
    } else {
      this.setState({
        addMenu: false
      })
    }
  }

  searchMeals(val){
    this.setState({listItem: Capitalize(val), search: true});
    axios.post("http://on-time.cc:8000/api/users/food/search", {q: Capitalize(val)}, {headers: {Authorization: "Token "+cookies.get('_sT')}} ).then((res) => {
      this.setState({searchList: res.data.meals});
    })
  }

  Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  addMeal(meal){
    var meals = this.state.list;
    meals.push(meal);
    this.setState({list: meals, listItem: "", searchList: undefined, pwTop: 5, pwFont: 16});
  }

  removeMeal(i){
    var meals = this.state.list;
    meals.splice(i, 1);
    this.setState({list: meals});
  }

  createMenu(){
    if(this.state.clickedAdd === 0){
      this.setState({clickedAdd: this.state.clickedAdd+1});
      var food_list = [];
      this.state.list.map((meal, i) => {
        food_list.push({_id: meal._id, name: meal.name, price: meal.price});
      });
      var req = this.state.totalPrice == "" ? {
        menu: {
          food_list: food_list,
          name: this.state.name
        }
      } : {
        menu: {
          food_list: food_list,
          name: this.state.name,
          price: this.state.totalPrice
        }
      };
      axios.post("http://on-time.cc:8000/api/users/food/menus/add", req, {headers: {Authorization: "Token "+cookies.get('_sT')}} ).then((res) => {
        this.stateNormal();
        axios.get('http://on-time.cc:8000/api/users/food/menus', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
          this.setState({menus: resp.data.menus});
        });
      });
    }
  }

  stateNormal(){
    this.setState({
      addMenu: false,
      name: "",
      unTop: 5,
      unFont: 16,
      listItem: "",
      pwTop: 5,
      pwFont: 16,
      totalPrice: "",
      emTop: 5,
      emFont: 16,
      list: [],
      clickedAdd: 0,
      searchList: undefined
    });
  }

  editMenu(menu){
    this.setState({
      name: this.state.menus[menu].name,
      totalPrice: this.state.menus[menu].price,
      list: this.state.menus[menu].food_list,
      addMenu: true,
      editMenu: true,
      editMenuId: this.state.menus[menu]._id
    });
    this.inputFocus("username");
    this.inputFocus("email");
  }

  updateMenu(){
    if(this.state.clickedAdd === 0){
      this.setState({clickedAdd: this.state.clickedAdd+1});
      var food_list = [];
      this.state.list.map((meal, i) => {
        food_list.push({_id: meal._id, name: meal.name, price: meal.price});
      });
      var req = this.state.totalPrice == "" ? {
        menu: {
          food_list: food_list,
          name: this.state.name,
          _id: this.state.editMenuId
        }
      } : {
        menu: {
          food_list: food_list,
          name: this.state.name,
          _id: this.state.editMenuId,
          price: this.state.totalPrice
        }
      };
      axios.post("http://on-time.cc:8000/api/users/food/menus/update", req, {headers: {Authorization: "Token "+cookies.get('_sT')}} ).then((res) => {
        this.stateNormal();
        this.setState({editMenuId: undefined, editMenu: false});
        axios.get('http://on-time.cc:8000/api/users/food/menus', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
          this.setState({menus: resp.data.menus});
        });
      });
    }
  }

  deleteMenu(){
    if(this.state.clickedAdd === 0){
      this.setState({clickedAdd: this.state.clickedAdd+1});
      axios.post("http://on-time.cc:8000/api/users/food/menus/remove/"+this.state.editMenuId, {}, {headers: {Authorization: "Token "+cookies.get('_sT')}} ).then(() => {
        this.stateNormal();
        this.setState({editMenuId: undefined, editMenu: false});
        axios.get('http://on-time.cc:8000/api/users/food/menus', {headers: {Authorization: "Token "+cookies.get('_sT')}}).then((resp) => {
          this.setState({menus: resp.data.menus});
        });
      })
    }
  }

  render(){
    return(
      <div className="orders">
        <div className="orders__header">
          <h3>Menus</h3>
          <button onClick={() => {this.addMenu()}}><Add /> Add menu</button>
        </div>
        <div className="menus__content">
          {this.state.menus ? 
            Object.keys(this.state.menus).map((i, menu) => {
              return <div className="menu" onClick={() => {this.editMenu(menu)}}>
                      <div>
                        <h4>{this.state.menus[menu].name}</h4>
                        <ul>
                          {Object.keys(this.state.menus[menu].food_list).map((i, meal) => {
                            return <li><div>{this.state.menus[menu].food_list[meal].name}</div><div>{this.state.menus[menu].food_list[meal].price} kn</div></li>
                          })}
                        </ul>
                      </div>
                      <div className="total-price"><div>Total price:</div><div>{this.state.menus[menu].price} kn</div></div>
                    </div>
            })
            : ""
          }
        </div>
        <div className="asign-wrapper" style={{display: this.state.addMenu ? "flex" : "none"}}>
          <div className="exit-asign" onClick={() => {this.exitAdd()}}></div>
          <div className="create-menu">
            <h3>{this.state.editMenu ? "Edit menu" : "Create menu"}</h3>
            <form>
              <div className="input-group">
                <label style={{fontSize: this.state.unFont, top: this.state.unTop}}>Name</label>
                <input type="text" 
                    onChange={(event) => {this.state.name == "" ? this.setState({name: event.target.value}) : this.setState({name: event.target.value})}} 
                    onFocus={() => this.inputFocus("username")} 
                    onBlur={() => this.inputBlur("username")}
                    value={this.state.name}/>
              </div>
              <div className="input-group">
                <label style={{fontSize: this.state.pwFont, top: this.state.pwTop}}>Add meal</label>
                <input type="text" 
                    onChange={(event) => {this.searchMeals(event.target.value)}} 
                    onFocus={() => this.inputFocus("password")} 
                    onBlur={() => this.inputBlur("password")}
                    value={this.state.listItem}/>
                  <div className="meal-search" style={{display: this.state.searchList ? "block" : "none"}}>
                    <ul>
                      {this.state.listItem != "" ?
                        this.state.searchList ?
                          this.state.searchList.map((meal, i) => {
                            return <li onClick={() => {this.addMeal(meal)}}><div>{meal.name}</div><div>{meal.price} kn</div></li>
                          })
                        : ""
                        : ""
                      }
                    </ul>
                  </div>
              </div>
              <ul>
                {this.state.list.length != 0 ?
                  this.state.list.map((meal, i) => {
                    return <li><div>{meal.name}</div><div>{meal.price} kn<span onClick={() => {this.removeMeal(i)}}><Add class="delete"/></span></div></li>
                  })
                  : ""
                }
              </ul>
              <div className="input-group">
                <label style={{fontSize: this.state.emFont, top: this.state.emTop}}>Total price (kn)</label>
                <input type="number" 
                    onChange={(event) => {this.state.totalPrice == "" ? this.setState({totalPrice: event.target.value}) : this.setState({totalPrice: event.target.value})}} 
                    onFocus={() => this.inputFocus("email")} 
                    onBlur={() => this.inputBlur("email")}
                    value={this.state.totalPrice}/>
              </div>
              {!this.state.editMenu ?
                <button type="button" onClick={() => {this.createMenu()}}><Add /> Add menu</button>
                :
                <div className="editingMenu"><div onClick={() => {this.deleteMenu()}}>Delete menu</div><button type="button" onClick={() => {this.updateMenu()}}><Add /> Update menu</button></div>
              }
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Menus;