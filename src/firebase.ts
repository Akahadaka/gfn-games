import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from './firebase.config.json';

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;
