
const INITIAL_STATE = {
    user: false,
    error: null,
    loading: false,
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case 'SET_USER' : 
            return {...state, user: action.payload, loading: false};
        case 'IS_LOADING' : 
            return {...state, loading: action.payload};
        case 'SET_AUTH_ERROR' : 
            return {...state, error: action.payload, loading: false};
        default :
            return state;
    }
}