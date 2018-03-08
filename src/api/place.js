import firebase from './../firebase';

export const getPlaces = () => {
    return firebase.database().ref('/places').once('value');
}

export const addPlace = async ({ name, city, street, codes, file }) => {
    const placesRef = firebase.database().ref('/places');
    const newPlaceKey = placesRef.push().key;

    // save image
    let image = null;
    if(file) {
        const storageRef = firebase.storage().ref();
        const placeImageRef = storageRef.child('place'+newPlaceKey+'/'+file.name);
        const placeImagePath = await placeImageRef.put(file)
        if(placeImagePath.metadata)
            image = placeImagePath.metadata.downloadURLs[0];
    }

    placesRef.child(newPlaceKey).update({ name, city, street, image });

    codes.forEach(code => {
        const newCodeKey = placesRef.child(newPlaceKey+'/codes').push().key;
        placesRef.child(newPlaceKey+'/codes/'+newCodeKey).update({ description : code.description });
    });

    return newPlaceKey;
}

export const getPlace = key => {
    return firebase.database().ref('/places/'+key).once('value');
}

export const updatePlace = async (key, { name, city, street, codes, file, image }) => {
    const placeRef = firebase.database().ref('/places/'+key);
    
    // save image
    //let image = null;
    if(file) {
        const storageRef = firebase.storage().ref();
        const placeImageRef = storageRef.child('place'+key+'/'+file.name);
        const placeImagePath = await placeImageRef.put(file)
        if(placeImagePath.metadata) {
            image = placeImagePath.metadata.downloadURLs[0];
        }
    }

    // update place name, address
    await placeRef.update({ name, city, street, image });

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