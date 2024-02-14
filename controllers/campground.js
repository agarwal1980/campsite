const Campground = require('../models/campground'); 
const axios = require('axios');
const routerError = require('../utils/AppError');
const db = Campground
const {cloudinary} = require('../cloudinary');
module.exports.index = async (req,res)=>{
    const c = await db.find({});
    res.render('index',{campgrounds:c}); 
}
module.exports.renderNewForm =async (req,res)=>{
    res.render('new');
}

module.exports.createNew = async (req,res)=>{
  const axios = require('axios');
  const data = await axios.get(`http://api.positionstack.com/v1/forward?access_key=96b96fac0f127e04ace3316179ce180a&query=${req.body.campground.location}`,{ headers: {
      Accept: "application/json"
  }})
    const lat = data.data.data[0].latitude
    const long = data.data.data[0].longitude
    if(!data){
       lat = 26.8228422
       long = 75.8657894
    }
    if(!req.body.campground) throw new routerError('Incomplete Data',400);
    const C = req.body.campground;
    C.images = req.files.map(f => ({url:f.path,filename:f.filename}));
    C.geometry = {
      type:'Point',
      coordinates :[lat,long]
    }
    C.author = req.user._id;
    const p = new db(C);
    await p.save();
    req.flash('success','SuccessFully created New Campground');
    res.redirect(`/campground`);
}

module.exports.showCamp =async (req,res)=>{
    const {id} = req.params;
    const c =await db.findById(id).populate({
      path:'review',
      populate:{
      path:'author' 
       }
      }).populate('author'); 
    if(!c){
      req.flash('error','Cannot find Campground');
      return res.redirect('/campground');
    }
    
    res.render('show',{campground:c});
}

module.exports.editCamp =async (req,res)=>{
    const {id} = req.params;
    const c = await db.findById(id);

    if(!c){
      req.flash('error','Cannot find Campground');
      return res.redirect('/campground');
    }
    res.render('edit',{campground:c});
  }

module.exports.updateCamp = async(req,res)=>{
    if(!req.body.campground) throw new routerError('Incomplete Data',400);
    const {id} = req.params;
    const c = await db.findByIdAndUpdate(id,req.body.campground,{runValidators:true},{new:true});
    const img = req.files.map(f => ({url:f.path,filename:f.filename}));
    c.images.push(...img);
    await c.save();
    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      await c.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
    }
    req.flash('success','SuccessFully Updated Campground');
    res.redirect(`/campground/${id}`);
}

module.exports.deleteCamp = async(req,res)=>{
    const {id} = req.params;
    const findC = await db.findById(id);
    const c = await db.findOneAndDelete({title:findC.title});
    req.flash('success','SuccessFully Deleted Campground');
    res.redirect('/campground');
}