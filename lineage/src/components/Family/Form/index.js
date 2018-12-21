import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import { withAuthorization } from '../../Session';
import { throws } from 'assert';

const FamilyForm = (props) => (
  <div className="card col-md-offset-3
                    col-md-6 col-xs-offset-1 col-xs-10
                    col-sm-offset-3 col-sm-6">
        <h1>Add Family Member</h1>
    <FamilyFormBase {...props} />
  </div>
);

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    yearBorn: '',
    yearPassed: '',
    relation: '',
    error: null,
};


class FamilyFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  handleValidation(){
    const { yearBorn, yearPassed } = this.state;
    let errors = [];
    let formIsValid = true;
    if(yearBorn > new Date().getFullYear()){
      formIsValid = false;
      errors.push("Year Born cannot be greater than "+new Date().getFullYear());
   }
   if(yearPassed > new Date().getFullYear()){
      formIsValid = false;
      errors.push("Year Passed cannot be greater than "+new Date().getFullYear());
   }
   if(yearPassed && yearBorn > yearPassed){
      formIsValid = false;
      errors.push("Year Passed cannot be less than "+yearBorn);
   }
   if(yearPassed - yearBorn > 145){
      formIsValid = false;
      errors.push("Age cannot be greater than 145 years");
   }
   this.setState({error: errors});
   return formIsValid;
}

  onSubmitButton = ( reload=false ) => {
    const _ = this ;
    if(this.handleValidation()){
      const { firstName, lastName, yearBorn, yearPassed,relation } = this.state;
      const { uid } = this.props.authUser;
      var postData={
        firstName: firstName,
        lastName: lastName,
        yearBorn : yearBorn,
        yearPassed : yearPassed,
        relatedPersonID: uid,
        firstLast:`${firstName.toLowerCase()}~${lastName.toLowerCase()}`,
        firstLastBorn:`${firstName.toLowerCase()}~${lastName.toLowerCase()}~${yearBorn}`
      };
      var newRelationKey = this.props.firebase.db.ref().child('persons').push().key;

      var updates = {};
      var treeData={
        "personID":newRelationKey,
        "relation_id":relation,
        "sort":this.state.sortTree
      };
      updates['/persons/' + newRelationKey] = postData;
      var newTreeKey = this.props.firebase.db.ref().child('tree/'+uid).push().key;
      updates['/tree/' + uid + '/'+newTreeKey+'/' ] = treeData;
      this.props.firebase.db.ref().update(updates).then((response)=>{
        _.props.setTreeData({});
        if(reload==true){
          //_.props.history.push(ROUTES.FAMILY_TREE);
          window.location.reload();
        }else
          _.props.history.push(ROUTES.HOME);
      });
    }
  };

  componentDidMount(){
    const _ = this ;
    const { uid } = this.props.authUser;
    this.props.firebase.db.ref('/tree/' + uid ).once('value').then(function(snap) {
      const treeSnapshot = snap.val();
      if(!treeSnapshot || Object.keys(treeSnapshot).length == 0){
        _.setState({
          relations: {
            "self":{
              name:"Self",
              sort:0
            }
          }
        })
      }else{
        let snap_val = Object.keys(treeSnapshot),spouse_exists=false;
        _.props.firebase.db.ref('relationType').once('value').then(function(snapshot) {
          const value = snapshot.val();
          snap_val.map((tree_relation)=>{
            if(value[treeSnapshot[tree_relation].relation_id])
            if(value[treeSnapshot[tree_relation].relation_id] !== undefined){
              if(value[treeSnapshot[tree_relation].relation_id].name == "Spouse"){
                spouse_exists=true;
              }
              if(value[treeSnapshot[tree_relation].relation_id].name != "Son" && value[treeSnapshot[tree_relation].relation_id].name != "Daughter"){
                delete value[treeSnapshot[tree_relation].relation_id];
              }
            }
          });
          Object.keys(value).forEach((index)=>{
            if(!spouse_exists && (value[index].name =="Son" || value[index].name =="Daughter" )){
              delete value[index];
            }
          });
          _.setState({
            relations:value
          });
        });
      }
    });
  }

  onChange = event => {
    event.persist();
    const thisEvent= event;
    this.setState({ [event.target.name]: event.target.value },()=>{
      if(thisEvent.target.name == "relation"){
        this.setState({
          sortTree:this.state.relations[thisEvent.target.value].sort
        });
      }
    });
  };

  generateOptions = (relations) =>{
    return (
      <React.Fragment>
        <option disabled value="">Select Relation</option>
        {Object.keys(relations).map((relation,index)=>(
          <option key={relation} value={relation}>{relations[relation].name}</option>
        ))}
      </React.Fragment>
    )
  }

  render() {
    const { firstName, lastName, yearBorn, yearPassed, relation, error } = this.state;

    const isInvalid = (firstName === '' || lastName === ''
                        || yearBorn === '' || relation === '') ;
    return (
      <div >
        <form >
          <div className="form-group">
            <input
              name="firstName"
              value={firstName}
              onChange={this.onChange}
              type="text"
              className="form-control"
              placeholder="First Name"
            />
          </div>
          <div className="form-group">
            <input
              name="lastName"
              value={lastName}
              onChange={this.onChange}
              type="text"
              className="form-control"
              placeholder="Last Name"
            />
          </div>
          <div className="form-group">
            <input
              name="yearBorn"
              value={yearBorn}
              onChange={this.onChange}
              type="number"
              className="form-control"
              placeholder="Year Born"
            />
          </div>
          <div className="form-group">
            <input
              name="yearPassed"
              value={yearPassed}
              onChange={this.onChange}
              type="number"
              className="form-control"
              placeholder="Year Passed (optional)"
            />
          </div>
          <div className="form-group">
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
          </div>
          <div className="col-sm-6 col-md-6">
            <button onClick={()=>this.onSubmitButton(true)} type="button" className="pbtn paper paper-raise-flatten" disabled={isInvalid}>
                + Add Another Person
            </button>
          </div>
          <div className="col-sm-6 col-md-6">
            <button onClick={this.onSubmitButton} type="button" className="pbtn paper paper-raise-flatten" disabled={isInvalid}>
                Submit
            </button>
          </div>
          {error && error.map((err,index)=>
            <div key={index} className="col-sm-12 col-md-12">
              <span>{err}</span>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const mapStateToProps = (state) =>({
  relationTypeData:state.relationTypeData
})

const mapDispatchToProps = dispatch => ({
  onComponentMount: relationTypeData => dispatch({ type: 'SET_RELATION_TYPE', relationTypeData }),
  setTreeData: tree => dispatch({ type: 'SET_TREE_DATA', tree })
});

export default compose(
  withRouter,
  withFirebase,
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(FamilyForm);
