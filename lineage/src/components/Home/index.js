import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from "react-router";

import { withFirebase } from '../Firebase';
import { Add } from '../Family';
import { SIGN_IN, FAMILY_TREE } from '../../constants/routes';
import Tree from '../Family/Tree';

class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      treeSnapshot: (Object.keys(this.props.tree).length > 0) ? this.props.tree : {},
      blankTree: false
    }
  }

  async componentDidMount() {
    if (Object.keys(this.state.treeSnapshot).length <= 0) {
      const _ = this; var checkUser = {};
      await this.props.firebase.users().on('value', snapshot => {
        checkUser = snapshot.val();
        this.props.onSetUsers(checkUser);
      });
      if (this.props.authUser || checkUser.length > 0) {
        this.props.firebase.db.ref('/tree/' + this.props.authUser.uid).once('value').then(async function (snap) {
          const treeSnapshot = snap.val();
          if (!treeSnapshot || Object.keys(treeSnapshot).length == 0) {
            //tree not exists
            _.setState({
              blankTree: true
            });
          }
          else {
            //tree exists
            let relationID = [],
              personID = [];
            Object.keys(treeSnapshot).map(function (subTree) {
              personID.push(treeSnapshot[subTree].personID)
              relationID.push(treeSnapshot[subTree].relation_id)
            });
            let personData = await _.getPersonData(personID);
            personData = personData.map((snap) => {
              return snap.val();
            })
            let relationData = await _.getRelationData(relationID);
            relationData = relationData.map((snap) => {
              return snap.val();
            })
            let relationMappedData = {};
            relationID.forEach((key, i) => relationMappedData[key] = relationData[i]);
            let personMappedData = {};
            personID.forEach((key, i) => personMappedData[key] = personData[i]);
            let mTree = [], subTreeFather = {},
              subTreeMother = {
                "name": "",
                "class": "woman",
              }, subTreeDaughter = [], subTreeSelf = {}, subTreeSon = [], person_exists = {}, subTreeSpouse = {}, mChildTree = {};
            relationMappedData = _.addPersonDataTorelationMappedData(relationMappedData, personMappedData, treeSnapshot);
            for (var key in relationMappedData) {
              if (relationMappedData[key].firstName !== undefined) {
                if (relationMappedData[key].name == "Mother") {
                  subTreeMother = {
                    "name": relationMappedData[key].firstName + " " + relationMappedData[key].yearBorn,
                    "class": "woman",
                  }
                  person_exists["mother"] = true;
                } else if (relationMappedData[key].name == "Father") {
                  // if()
                  subTreeFather = {
                    "name": relationMappedData[key].firstName + " " + relationMappedData[key].yearBorn,
                    "class": "man",
                    "textClass": "emphasis",
                    "marriages": [{
                      "spouse": subTreeMother
                    }]
                  }
                  person_exists["father"] = true;
                } else if (relationMappedData[key].name == "Spouse") {
                  subTreeSpouse = {
                    "name": relationMappedData[key].firstName + " " + relationMappedData[key].yearBorn,
                    "class": "woman"
                  }
                  person_exists["spouse"] = true;
                }
              } else if (relationMappedData[key].data !== undefined) {

                if (relationMappedData[key].name == "Son") {
                  relationMappedData[key].data.forEach((data) => {
                    subTreeSon.push({
                      "name": data.firstName + " " + data.yearBorn,
                      "class": "man"
                    });
                    person_exists["son"] = true;
                  });
                } else if (relationMappedData[key].name == "Daughter") {
                  relationMappedData[key].data.forEach((data) => {
                    subTreeDaughter.push({
                      "name": data.firstName + " " + data.yearBorn,
                      "class": "woman"
                    });
                    person_exists["daughter"] = true;
                  });
                }
              }
            }
            subTreeSelf = {
              "name": relationMappedData["self"].firstName + " " + relationMappedData["self"].yearBorn,
              "class": "man"
            }

            if (person_exists.father) {
              mTree = {
                ...subTreeFather
              }
            }
            if (person_exists.mother && !person_exists.father) {
              mTree = {
                ...subTreeMother,
                marriages: [{
                  "children": [{}]
                }]
              }
            }
            if (person_exists.mother && person_exists.father) {
              mTree["marriages"][0]["spouse"] = {
                ...subTreeMother
              }
            }
            if (person_exists.son || person_exists.daughter) {
              mChildTree = [
                ...subTreeSon, ...subTreeDaughter
              ];
            }
            if (person_exists.spouse) {
              subTreeSelf = {
                ...subTreeSelf,
                "marriages": [{
                  "spouse": subTreeSpouse
                }]
              }
            }
            if (person_exists.son || person_exists.daughter) {
              subTreeSelf["marriages"][0] = {
                ...subTreeSelf["marriages"][0],
                "children": mChildTree
              }
            }
            if (person_exists.mother || person_exists.father) {
              mTree["marriages"][0]["children"] = [{
                ...subTreeSelf
              }];

            } else {
              mTree = {
                ...subTreeSelf
              }
            }
            mTree["uid"]=_.props.authUser.uid;
            //add tree to redux
            _.props.setTreeData(mTree);
            _.setState({
              treeSnapshot: mTree
            });
          }
        });
      } else {
        this.setState({
          blankTree: true
        });
        _.props.setTreeData({});
      }
    }
  }


  addPersonDataTorelationMappedData = (relationMappedData, personMappedData, treeSnapshot) => {
    let nrelationMappedData = {};
    for (var tree in treeSnapshot) {
      if (nrelationMappedData[treeSnapshot[tree].relation_id] === undefined) {
        nrelationMappedData[treeSnapshot[tree].relation_id] = [];
      }
      if (relationMappedData[treeSnapshot[tree].relation_id] !== undefined) {
        if (treeSnapshot[tree].relation_id != "self" && (relationMappedData[treeSnapshot[tree].relation_id].name === "Son" ||
          relationMappedData[treeSnapshot[tree].relation_id].name === "Daughter")) {
          nrelationMappedData[treeSnapshot[tree].relation_id].name = relationMappedData[treeSnapshot[tree].relation_id].name;
          if (nrelationMappedData[treeSnapshot[tree].relation_id]["data"] === undefined) {
            nrelationMappedData[treeSnapshot[tree].relation_id]["data"] = [];
          }
          nrelationMappedData[treeSnapshot[tree].relation_id]["data"].push({
            ...relationMappedData[treeSnapshot[tree].relation_id],
            ...personMappedData[treeSnapshot[tree].personID]
          });
        } else {
          nrelationMappedData[treeSnapshot[tree].relation_id] = {
            ...relationMappedData[treeSnapshot[tree].relation_id],
            ...personMappedData[treeSnapshot[tree].personID]
          };
        }
      }
    }
    for (var relation in nrelationMappedData) {
      if (nrelationMappedData[relation].length > 0) {
        delete nrelationMappedData[relation];
      }
    }
    return nrelationMappedData;
  }

  getPersonData = async (personID) => {
    let reads = [];
    const _ = this;
    reads = await personID.map(async function (id) {
      var promise = await _.props.firebase.db.ref('persons/' + id).once('value');
      return promise;
    });
    return await Promise.all(reads);
  }

  getRelationData = async (RelationID) => {
    let reads = [];
    const _ = this;
    reads = await RelationID.map(async function (id) {
      var promise = await _.props.firebase.db.ref('relationType/' + id).once('value');
      return promise;
    });
    return await Promise.all(reads);
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  onAddClick = () => {
    this.props.authUser ? (
      this.props.history.push(FAMILY_TREE)
    ) : (
        this.props.history.push(SIGN_IN)
      );
  }

  renderLoading = () => {
    return(
      <div className="col-md-6 com-sm-6 col-md-offset-3 col-sm-offset-3" styles={{ textAlign: "center" }}>
      <div className="dna">
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      <div className="ele">
        <div className="dot"></div>
      </div>
      </div>
            </div>
      
    );
  }
  renderAddTree = (props) => (
    <React.Fragment>
      {(props.heading)?
      <h1>{props.heading}</h1>
      :  ""
    }
      <div onClick={this.onAddClick}>
        <Add />
      </div>
    </React.Fragment>
  )

  render() {
    return (
      <div>
        {(this.props.authUser !== undefined && this.props.authUser != null && this.props.authUser.uid !== undefined) ?
          <React.Fragment>
            <h1>Your Family Tree</h1>
            {
              (Object.keys(this.state.treeSnapshot).length > 0) ?
                <Tree /> :
                <React.Fragment>
                  {
                    (this.state.blankTree === true) ?
                      <this.renderAddTree />
                    :
                      <this.renderLoading />
                  }
                </React.Fragment>
            }

          </React.Fragment>
          :
          <this.renderAddTree heading={"Start your family tree here"} />
        }
      </div>

    );
  }
}

const mapStateToProps = state => ({
  users: state.userState.users,
  authUser: state.sessionState.authUser,
  sessionState: state.sessionState,
  tree: state.treeState.tree
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
  setTreeData: tree => dispatch({ type: 'SET_TREE_DATA', tree })
});

const condition = authUser => !!authUser;

export default compose(
  withRouter,
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(HomePage);
