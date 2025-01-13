var express = require('express');
var router = express.Router();
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
require('dotenv').config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/users');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).render('login', { title: 'Login', error: 'Login failed, please try again.' });
  }
});

router.post('/logout', function(req, res, next) {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;