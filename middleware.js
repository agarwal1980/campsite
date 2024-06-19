const campgroundSchema = require('./utils/ValidSchema');
const routerError = require('./utils/AppError');
const Campground = require('./models/campground'); 
const express = require('express');

module.exports.isLoggedIn= async (req,res,next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log('isLoggedIn trigerred ', req.session.redirectUrl);
        req.flash('error','login required');
        return res.redirect('/login');
      }
  next();
}

module.exports.ValidateSchema=(req,res,next)=>{
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(e => e.message).join(',');
    throw new routerError(msg,400)
  }else{
    next();
  }
}

module.exports.isAuthor = async(req,res,next)=>{
  const {id} = req.params;
  const camp =await Campground.findById(id); 
  if(!camp.author.equals(req.user._id)){
    req.flash('error', 'You dont have permission');
    return res.redirect(`/campground/${id}`);
  }
  next();
}

module.exports.ValidateReview = (req,res,next) =>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(e => e.message).join(',');
    throw new routerError(msg,400)
  }else{
    next();
  }
}

module.exports.saveRedirect = (req,res,next) =>{
  if(req.session.redirectUrl){
   console.log('saveRedirect call') 
  res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};