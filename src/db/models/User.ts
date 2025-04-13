import mongoose from "mongoose"
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },

  telnumber: {
    type: String,
    required: [true, "Please add your Telephone number"],
    match:[
        /^[0-9]{10}$/,
        "Please provide a valid phone number"
    ],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[ \]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[09]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address",
    ],
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Bcrypt add salt
// UserSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// //add method
// UserSchema.methods.getSignedJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User
