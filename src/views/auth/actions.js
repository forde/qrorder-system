import firebase from './../../firebase';

export const setUser = user => dispatch => {
    dispatch({ type: 'SET_USER', payload: user });
}

export const signIn = (email, password) => dispatch => {
    dispatch({ type: 'IS_LOADING', payload: true });
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            dispatch({ type: 'SET_AUTH_ERROR', payload: null });
        })
        .catch(error => {
            dispatch({ type: 'SET_AUTH_ERROR', payload: error.message });
        });
}

export const signOut = () => dispatch => {
    firebase.auth().signOut()
        .then(() => {
            dispatch({ type: 'SET_USER', payload: null });
        });
}

