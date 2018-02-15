import firebase from './../firebase';

export const getMenu = placeKey => {
    return firebase.database().ref('/placeMenus/'+placeKey).once('value');
}