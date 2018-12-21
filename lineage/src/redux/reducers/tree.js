const INITIAL_STATE = {
    tree: {},
};

const applyTreeData = (state, action) => ({
    tree:action.tree
});
// const resetTreeData = (state, action) => ({
//     tree:{}
// });

function treeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'SET_TREE_DATA': {
            return applyTreeData(state, action);
        }
        // case 'RESET_TREE_DATA': {
        //     return resetTreeData(state,action);
        // }
        default:
            return state;
    }
}

export default treeReducer;
