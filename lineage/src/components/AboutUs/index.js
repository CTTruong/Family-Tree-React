import React, { Component } from 'react';
import Map from './map.jpg'

class AboutUs extends Component {

  render() {
    return (
      <div style={{"width":"80%","margin":"auto"}}>
        <h1 style={{"width":"70%"}}>About Us</h1>
        <p><img src={Map} style={{"width":"30%","float":"right","marginRight":"10px"}} />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    );
  }
}

export default AboutUs;
