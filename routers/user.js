const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport')
const userController = require('../controllers/user');
const {saveRedirect} = require('../middleware.js'); 

router.get('/register',userController.getRegister)

router.post('/register',wrapAsync(userController.Registered))

router.get('/login',userController.renderLogin)

router.post('/login',saveRedirect,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), userController.Login )

router.get('/logout',wrapAsync(userController.logout))

module.exports = router;