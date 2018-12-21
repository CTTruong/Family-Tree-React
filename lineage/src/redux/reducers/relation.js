const INITIAL_STATE = {
    relationType:[]
  };
  
  const saveRelationTypeData = (state, action) => ({
    ...state,
    relationTypeData: action.relationTypeData,
  });

  
  function messageReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'SET_RELATION_TYPE': {
        return saveRelationTypeData(state, action);
      }
      default:
        return state;
    }
  }
  
  export default messageReducer;
  