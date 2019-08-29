import React from 'react';
import Order from '../order';
import '../catering/style.scss';

class Orders extends React.Component {
  render(){
    return(
      <div className="orders">
        <div className="orders__header">
          <h3>Home</h3>
        </div>
        <div className="orders__content">
          {this.props.orders ? 
            Object.keys(this.props.orders).map((i, order) => {
              return <Order key={i} 
                            food_list={this.props.orders[order].food_list} 
                            status={this.props.orders[order].status} 
                            time={this.props.orders[order].time} 
                            delivery_location={this.props.orders[order].delivery_location}
                            deliverer={this.props.orders[order].deliverer}
                            _id={this.props.orders[order]._id}
                            updateStatus={(id, status) => {this.props.updateStatus(id, status)}}
                            asignDeliverer={(id) => {this.props.asignDeliverer(id)}}
                      />
            })
            :
            ""
          }
        </div>
        <div className="asign-wrapper" style={{display: this.props.asignDelivererState ? "flex" : "none"}}>
          <div className="exit-asign" onClick={() => {this.props.exitAsign()}}></div>
          <div className="deliverer-list">
            <h3>Asign deliverer</h3>
            <ul>
              {this.props.deliverers ? 
                this.props.deliverers.map((deliverer) => {
                  return <li>
                    <label class="container">
                      <div className="profile-picture" style={{backgroundImage: "url("+require('../../resources/profile.png')+")"}}></div>
                      {deliverer.name}
                      <input type="checkbox" onClick={() => {this.props.updateDeliverer(deliverer._id, deliverer.name)}} />
                      <span class="checkmark"></span>
                    </label>
                  </li>
                })
              :
                ""
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Orders;