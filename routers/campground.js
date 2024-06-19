const express = require('express');
const router = express.Router();
const Campground = require('../models/campground'); 
const routerError = require('../utils/AppError');
const wrapAsync = require('../utils/wrapAsync');
const campgroundSchema = require('../utils/ValidSchema');
const methodOverride = require('method-override')
const {isLoggedIn,ValidateSchema,isAuthor} = require('../middleware')
const campController = require('../controllers/campground');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});
const db = Campground
router.use(express.urlencoded({extended:true}));

router
 .route('/')
 .get(wrapAsync(campController.index))
 .post(isLoggedIn,upload.array('image'),ValidateSchema,wrapAsync(campController.createNew)) 

router.get('/new' ,isLoggedIn , wrapAsync(campController.renderNewForm));
  
router.get('/:id' , wrapAsync(campController.showCamp))
  
router.get('/:id/edit' ,isLoggedIn , isAuthor, wrapAsync(campController.editCamp))   
   
router.put('/:id',isLoggedIn,isAuthor,upload.array('images'),ValidateSchema,wrapAsync(campController.updateCamp));
  
router.delete('/:id' ,isAuthor, wrapAsync(campController.deleteCamp))

module.exports = router;  