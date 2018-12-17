import React, { Component } from 'react';
import styles from './index.css';
import Basic from './basic-kit.png';
import Delux from './delux-kit.png';
class Shop extends Component {

  render() {
    return (
      <div className="shop_products">
        <h1>Shop</h1>
        <div className="col-md-offset-1 col-md-4">
            <h3>DNA Test Kit</h3>
            <div><img className="basic-kit" src={Basic} />
            </div>
            <button className="pbtn">Buy Now</button>
        </div>

        <div className="col-md-offset-1 col-md-4">
            <h3>Heath + DNA Test Kit</h3>
            <div><img className="delux-kit" src={Delux} />
            </div>
            <button className="pbtn">Buy Now</button>
        </div>
      </div>
    );
  }
}

export default Shop;
