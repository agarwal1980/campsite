const express = require('express')
const AppError = require('../utils/AppError');
const wrapAsync = require('../utils/wrapAsync');
const Rating = require('../models/rating');
const reviewSchema = require('../utils/validReview');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground'); 
const {isLoggedIn,ValidateReview,isAuthor} = require('../middleware')
const revwController = require('../controllers/review');
const db = Campground;
  
router.post('/',ValidateReview,isLoggedIn,wrapAsync(revwController.addReview));
  
router.delete('/:revwId',isLoggedIn,wrapAsync(revwController.deleteReview))

module.exports = router;