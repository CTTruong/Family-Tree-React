import React, { Component } from 'react';
import Map from './map.jpg'
import './styles.css';

class AboutUs extends Component {

  render() {
    return (
      <div className="aboutUs-container">
        <h1 className="about-us">About Us</h1>
        <p><img className="about-map" src={Map} />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.Duis enim orci, malesuada eu lobortis in, vestibulum sit amet tortor.
            Cras pretium dui in nulla iaculis pretium. Nunc non nunc interdum, ornare nunc ac, luctus est.
        </p>
      </div>
    );
  }
}

export default AboutUs;
