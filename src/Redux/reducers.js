const initialState = {
    name: '',
    group: '',
    messages: [],
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'JOIN_GROUP':
            return {
                ...state,
                name: action.payload.name,
                group: action.payload.group,
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: action.payload,
            };
        default:
            return state;
    }
};
export default chatReducer