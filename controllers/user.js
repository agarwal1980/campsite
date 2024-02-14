const User = require('../models/user');
const passport = require('passport')

module.exports.getRegister = (req,res)=>{
    res.render('user/register');
}

module.exports.Registered = async (req,res,next)=>{
    try{
      const {username,password,email} = req.body;
      const user = new User({
       email,
       username
      });
      const registeredUser = await User.register(user,password);
      req.login(registeredUser,err => {
        if(err) return next(err);
        req.flash('success','Congrats! You are registered');
        res.redirect('/campground');
      })
    }catch(e){
      req.flash('error',e.message);
      res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('user/login',{query:req.query.redirect});
}

module.exports.Login = async(req,res)=>{
    req.flash('success',`Welcome back ${req.body.username}!`); 
    const redirectUrl = req.query.redirect || '/campground';
    res.redirect(redirectUrl);
}

module.exports.logout = async(req,res,next)=>{
    req.logout(err =>{
      return next(err);
    });
    req.flash('success','GoodBye!!');
    res.redirect('/login');
}