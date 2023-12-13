import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyDBYmC2kgFeHY_E6g_MCHc-F-TkF4R5Gg8",
    authDomain: "bibliotecasq3.firebaseapp.com",
    projectId: "bibliotecasq3",
    storageBucket: "bibliotecasq3.appspot.com",
    messagingSenderId: "80998783765",
    appId: "1:80998783765:web:c3fb5a9143be76c280a71c"
  };

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();