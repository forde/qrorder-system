import firebase from './../firebase';

export const getPlaces = () => {
    return firebase.database().ref('/places').once('value');
}

export const addPlace = ({ name, city, street, codes }) => {
    const placesRef = firebase.database().ref('/places');
    const newPlaceKey = placesRef.push().key;

    placesRef.child(newPlaceKey).update({ name, city, street });

    codes.forEach(code => {
        const newCodeKey = placesRef.child(newPlaceKey+'/codes').push().key;
        placesRef.child(newPlaceKey+'/codes/'+newCodeKey).update({ description : code.description });
    });

    return newPlaceKey;
}

export const getPlace = key => {
    return firebase.database().ref('/places/'+key).once('value');
}

export const updatePlace = async (key, { name, city, street, codes }) => {
    const placeRef = firebase.database().ref('/places/'+key);

    // update place name, address
    await placeRef.update({ name, city, street });

    // update place codes
    const usedCodeKeys = await Promise.all(codes.map(async code => {
        // if code has id - update, if not - add new code
        const codeKey = code.id || await placeRef.child('/codes').push().key;
        await placeRef.child('/codes/'+codeKey).update({ 
            description : code.description 
        });
        return codeKey;
    }));

    //cleanup deleted codes if any
    const savedCodes = await placeRef.child('/codes').once('value');
    if(savedCodes.val()) {
        const savedCodeKeys = Object.keys(savedCodes.val());
        await Promise.all(savedCodeKeys.map(async key => {
            if(usedCodeKeys.indexOf(key) === -1) {
                await placeRef.child('/codes/'+key).remove();
            }
        }));
    }

    return placeRef.once('value');
}

export const deletePlace = key => {
    return firebase.database().ref('/places/'+key).remove();
}