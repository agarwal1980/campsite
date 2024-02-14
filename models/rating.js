const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    desc : String,
    range : {
        type:Number
    },
    author:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'

    }
})

module.exports = mongoose.model('Rating',ratingSchema);