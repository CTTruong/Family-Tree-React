import React, { Component } from 'react';
import styles from './index.css'
import Basic from './basic-kit.png';
import Delux from './delux-kit.png';
import Checkout from '../Checkout'

class Shop extends Component {

  render() {
    return (
      <div className="shop_products">
        <h1>Shop</h1>
        <div className="col-md-offset-1 col-md-4">
            <h3>DNA Test Kit</h3>
            <div>
            <img className="basic-kit" src={Basic} />
            </div>
            <Checkout name="DNA Test Kit" description="DNA Test Kit" amount={24} />
        </div>

        <div className="col-md-offset-1 col-md-4">
            <h3>Heath + DNA Test Kit</h3>
            <div>
            <img className="delux-kit" src={Delux} />
            </div>
            <Checkout name="Health + DNA Test Kit" description="Health + DNA Test Kit" amount={30} />
        </div>
      </div>
    );
  }
}

export default Shop;
