const mongoose = require('mongoose');
const Rating = require('./rating')
const Schema = mongoose.Schema;

const imgSchema = new Schema ({
    url:String,
    filename:String
  })
imgSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200');
})
const opts = {toJSON :{virtuals:true}}
const campSchema = new Schema(
    {
        title:String,
        type:{
          type: String,
          required: true,
          default: 'Feature' 
        },
        geometry:{
          type:{
            type:String,
            enum:['Point'],
            required:true
          },
          coordinates:{
            type:[Number],
            required:true
          }
        },
        location:String,
        price:Number,
        images:[imgSchema],
        description:String,
        author:{
          type:Schema.Types.ObjectId,
          ref:'User'
        }
        ,review :[
            {
                type:Schema.Types.ObjectId,
                ref:'Rating'
            }
        ]
    } ,opts
)
campSchema.virtual('properties.popUpMarkup').get(function(){
  return ` <a href="campground/${this._id}" >${this.title}</a>`;
})
campSchema.post('findOneAndDelete',async function(doc){
  if(doc){
    await Rating.deleteMany({_id:{$in :doc.review}})
  }
})

module.exports = mongoose.model('Campground',campSchema);