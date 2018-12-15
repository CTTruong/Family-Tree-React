import React, { Component } from 'react';
import styles from './index.css'
class Shop extends Component {

  render() {
    return (
      <div className="shop_products">
        <h1>Shop</h1>
        <div className="col-md-offset-1 col-md-4">
            <h3>DNA Test Kit</h3>
            <div style={{"height":"200px", "border": "1px solid rgb(170, 170, 170)"}}> 
            </div>
            <button className="pbtn" style={{"width": "200px","borderRadius":"25px"}}>Buy Now</button>
        </div>
        
        <div className="col-md-offset-1 col-md-4">
            <h3>Heath + DNA Test Kit</h3>
            <div style={{"height":"200px", "border": "1px solid rgb(170, 170, 170)"}}>                 
            </div>
            <button className="pbtn" style={{"width": "200px","borderRadius":"25px"}}>Buy Now</button>
        </div>
      </div>
    );
  }
}

export default Shop;
