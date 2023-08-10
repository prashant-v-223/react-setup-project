// actions.js
export const joinGroup = (name, group) => {
    return (dispatch) => {

        // Dispatch the join action
        dispatch({
            type: 'JOIN_GROUP',
            payload: { name, group },
        });
    };
};

export const addMessage = (message) => {
    return (dispatch) => {

        // Dispatch the join action
        dispatch({
            type: 'ADD_MESSAGE',
            payload: message,
        });
    };
};