import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import './styles.css';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: this.props.result
        }
    }

    render() {
        return (
            <div className="list">
                {
                    this.state.result.map((item, index) => {
                        return (
                            <div key={index} className="item col-md-12 col-sm-12 col-lg-12">
                                <h4>{item.firstName} {item.lastName}</h4>
                                <p>Year Born: {item.yearBorn}</p>
                                {(item.yearPassed != "") ? <p>Year Passed: {item.yearPassed}</p> : ""}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default withFirebase(withRouter(Result));
