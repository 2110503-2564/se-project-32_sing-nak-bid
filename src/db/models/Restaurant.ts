import mongoose from "mongoose"

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a restaurant name."],
    unique: true,
    trim: true,
    maxlength: [50, "Restaurant name cannot be more than 50 characters."],
  },
  address: {
    type: String,
    required: [true, "Please add a restaurant address"],
  },
  district: {
    type: String,
    required: [true, "Please add a restaurant district"],
  },
  province: {
    type: String,
    required: [true, "Please add a restaurant province"],
  },
  postalcode: {
    type: String,
    required: [true, "Please add a restaurant postalcode"],
    maxlength: [5, "Postal Code can not be more than 5 digits"],
  },

  tel: {
    type: String,
    required: [true, "Please add a restaurant Telephone number"],
  },
  region: {
    type: String,
    required: [true, "Please add a region"],
  },
  opentime: {
    type: String,
    required: [true, "Please add a restaurant open time"],
    match: [
      /^\d{2}:\d{2}$/,
      "Please enter a valid opening time in HH:mm format",
    ],
  },
  closetime: {
    type: String,
    required: [true, "Please add a restaurant close time"],
    match: [
      /^\d{2}:\d{2}$/,
      "Please enter a valid closing time in HH:mm format",
    ],
  },
  picture: {
    type: String,
    required: [true, "Please add a restaurant picture"],
  },
  
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
//Reverse populate with virtuals
RestaurantSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema)||mongoose.models.Restaurant
export default Restaurant

