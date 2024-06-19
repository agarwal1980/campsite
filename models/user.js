const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:[true,'Email Is Neccesary'],
        unique:true
    }
})
userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model('User',userSchema);