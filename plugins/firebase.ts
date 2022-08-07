import { defineNuxtPlugin } from '#app';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp;
    $firebaseDB: Firestore;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyDskyUlYX_3PO7ZBwTXjoTiO9aVceS1wOQ",
    authDomain: "phrasebbs.firebaseapp.com",
    projectId: "phrasebbs",
    storageBucket: "phrasebbs.appspot.com",
    messagingSenderId: "501839072363",
    appId: "1:501839072363:web:5889fa3860da58fd8ff52e"
  };

  const app = initializeApp(firebaseConfig);

  nuxtApp.provide('firebaseApp', app);
  nuxtApp.provide('firebaseDB', getFirestore(app));
});