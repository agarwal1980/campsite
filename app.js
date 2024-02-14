if(process.env.NODE_ENV!='production'){
  require('dotenv').config()
}

const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate') 
const joi = require('joi');
const campRouter = require('./routers/campground');
const revwRouter = require('./routers/review');
const Campground = require('./models/campground'); 
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const UserRouter = require('./routers/user');
const MongoDBStore = require('connect-mongo');

const db = Campground;
const dbUrl = process.env.DB_URL;  

mongoose.connect(dbUrl).
  then(()=>{
    console.log('Mongo Connection Open');
  })
  .catch(err =>{
    console.log("Connection Failed");
    console.log(err);
  }) 

app.engine('ejs',ejsMate)  
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))



const sessionConfig = {
  secret:process.env.SECRET,
  resave:true,
  saveUninitialized:true,
  store: MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter:24*3600 // seconds
  }),
  cookie:{
    httpOnly:true,
    secure:true,
    expires:Date.now() + 1000 * 60 * 60 * 24 *7 ,
    maxAge:1000 * 60 * 60 * 24 *7 
  }
}
  
app.use(session(sessionConfig));
app.use(flash());
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();  
})  
app.use('/',UserRouter);
app.use('/campground',campRouter);
app.use('/campground/:id/review',revwRouter);
app.get('/',(req,res)=>{
  res.render('home')
})
   
app.use((err,req,res,next)=>{
  const {status=500} = err;
  if(!err.message) err.message='Server side Error'
  res.status(status).render('error',{err});
})

// app.get('/fakeUser',async (req,res)=>{
//   const U = new User({
//     email:'coltt@gmail.com',
//     username: 'colttttt'
//   });
//   const newUser = await User.register(U,'chicken nugeet'); 
//   res.send(newUser);
// })

app.listen(3000,()=>{ 
    console.log('App is Listening at PORT 3000');
});   

//9928972681