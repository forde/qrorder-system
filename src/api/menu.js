import firebase from './../firebase';

export const getMenu = placeKey => {
    return firebase.database().ref('/placeMenus/'+placeKey).once('value');
}

export const updateMenu = async (placeId, menu) => {
    const placeMenuRef = firebase.database().ref('/placeMenus/'+placeId);

    // update place name, address
    await placeMenuRef.update(menu);


    return placeMenuRef.once('value');
}