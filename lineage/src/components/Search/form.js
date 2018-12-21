import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import './styles.css';



const Form = (props) => (
    <div >
        <h1>Search for Person</h1>
        <div></div>
        <FormBase {...props} />
    </div>
);

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    yearBorn: '',
    // relation: '',
    error: null,
};


class FormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.persons=[]
    }

    handleValidation() {
        const { yearBorn } = this.state;
        let errors = [];
        let formIsValid = true;
        if (yearBorn > new Date().getFullYear()) {
            formIsValid = false;
            errors.push("Year Born cannot be greater than " + new Date().getFullYear());
        }
        if (yearBorn && yearBorn < 1850) {
            formIsValid = false;
            errors.push("Year Born cannot be less than 1850");
        }
        this.setState({ error: errors });
        return formIsValid;
    }

    onSubmitButton = () => {
        const _=this; let db, persons = [];
        if (this.handleValidation()) {
            const { firstName, lastName, yearBorn } = this.state;
            if (yearBorn) {

                db = this.props.firebase.db
                    .ref('persons')
                    .orderByChild('firstLastBorn')
                    .equalTo(`${firstName.toLowerCase()}~${lastName.toLowerCase()}~${yearBorn}`)
            } else {

                db = this.props.firebase.db
                    .ref('persons')
                    .orderByChild('firstLast')
                    .equalTo(`${firstName.toLowerCase()}~${lastName.toLowerCase()}`)
            }
            db.once('value').then( function (snapshot) {
                var result = snapshot.val();
                Object.keys(result).forEach(element => {
                   persons.push(result[element]);
                });
                _.props.searchResults(persons);
            });
        }
    };

    onChange = event => {
        event.persist();
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { firstName, lastName, yearBorn, error } = this.state;
        const isInvalid = (firstName === '' || lastName === '');
        return (
            <div id="searchForm">
                <form >
                    <div className="form-group col-md-offset-3 col-sm-offset-3 col-md-6 col-sm-6">
                        <input
                            name="firstName"
                            value={firstName}
                            onChange={this.onChange}
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="form-group col-md-offset-3 col-sm-offset-3 col-md-6 col-sm-6">
                        <input
                            name="lastName"
                            value={lastName}
                            onChange={this.onChange}
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                        />
                    </div>
                    <div className="form-group col-md-offset-3 col-sm-offset-3 col-md-6 col-sm-6">
                        <input
                            name="yearBorn"
                            value={yearBorn}
                            onChange={this.onChange}
                            type="number"
                            className="form-control"
                            placeholder="Year Born (Optional)"
                        />
                    </div>
                    {/* <div className="form-group">
            <select
              name="relation"
              value={relation}
              onChange={this.onChange}
              className="form-control"
            >
            {this.state.relations?
                this.generateOptions(this.state.relations)
              :
              <option value="">Loading Relations...</option>
            }
            </select>
          </div> */}

                    <div className=" col-md-offset-3 col-sm-offset-3 col-md-6 col-sm-6">
                        <button onClick={this.onSubmitButton} type="button" className="pbtn paper paper-raise-flatten" disabled={isInvalid}>
                            Search
            </button>
                    </div>
                    {error && error.map((err, index) =>
                        <div key={index} className="col-sm-12 col-md-12">
                            <span>{err}</span>
                        </div>
                    )}
                </form>
            </div>
        );
    }
}

export default compose(
    withRouter,
    withFirebase
)(Form);
