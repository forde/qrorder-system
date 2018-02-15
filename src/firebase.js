import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA8BEQyWtOiUTzh1IcaRW2pAn9l3DRxJ64",
    authDomain: "qrorder-a9978.firebaseapp.com",
    databaseURL: "https://qrorder-a9978.firebaseio.com",
    projectId: "qrorder-a9978",
    storageBucket: "qrorder-a9978.appspot.com",
    messagingSenderId: "256903876344"
};

export default firebase.initializeApp(config);
