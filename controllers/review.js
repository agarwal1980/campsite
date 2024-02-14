const AppError = require('../utils/AppError');
const Campground = require('../models/campground'); 
const Rating = require('../models/rating');
const db = Campground;

module.exports.addReview = async (req,res)=>{
    const r = new Rating(req.body.rating);
    const findCampground = await db.findById(req.params.id);
    findCampground.review.push(r)
    await findCampground.save();
    r.author = req.user._id;
    await r.save();
    req.flash('success','Created New Review');
    res.redirect(`/campground/${req.params.id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,revwId} = req.params;
    const revw = await Rating.findById(revwId);
    if(!revw.author.equals(req.user._id)){
       req.flash('error','You are not authorized to delete')
       return res.redirect(`/campground/${id}`);
    }

    const c = await db.findByIdAndUpdate(id, {$pull: {review : revwId}});
    const r = await Rating.findByIdAndDelete(revwId);
    req.flash('success','Review deleted');
    res.redirect(`/campground/${id}`);
}  