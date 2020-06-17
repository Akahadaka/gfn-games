import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyBmlYknpEzdc0D5gEtw0DUaoVq3OWPzA28',
  authDomain: 'gfn-games.firebaseapp.com',
  databaseURL: 'https://gfn-games.firebaseio.com',
  projectId: 'gfn-games',
  storageBucket: 'gfn-games.appspot.com',
  messagingSenderId: '128823013918',
  appId: '1:128823013918:web:c56408ef8452262d43340f',
  measurementId: 'G-WLZJCZ476E',
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;
