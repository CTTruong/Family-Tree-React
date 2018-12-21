import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { FaAngleLeft } from 'react-icons/fa';

import { withFirebase } from '../Firebase';
import Form from './form';
import Result from './result';

const SearchBase = (props) => (
    <div className="card col-md-offset-3 col-md-6 col-xs-offset-1 col-xs-10 col-sm-offset-3 col-sm-6">
        <Search {...props} />
    </div>
)

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: []
        }
    }

    searchResults = (result) => {
        this.setState({
            result: result
        });
    }

    resetResult = () => {
        this.setState({
            result: []
        });
    }

    render() {
        if (this.state.result.length > 0) {
            return (
                <React.Fragment>
                    <div style={{ float: "left" }}>
                        <div className="form-group">
                            <button onClick={this.resetResult} className="pbtn" style={{ width: "150px" }}>
                                <span className="icon"><FaAngleLeft size={20} /></span> Back to Search
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12" style={{textAlign: "center"}}>
                        <h3>Your Search Result</h3>
                    </div>
                    <Result result={this.state.result} />
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <Form searchResults={this.searchResults} />
            </React.Fragment >
        );
    }
}

export default compose(
    withRouter,
    withFirebase,
)(SearchBase);
