import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: { type: String, maxlength: 256, minlength: 3, required: true },
  email: { type: String },
  joinedAt: { type: Date, default: Date },
  bio: { type: String },
  profileImgUrl: { type: String },
  profileCoverUrl: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: "tweets" }],
  onBoarded: { type: Boolean, default: false },
  displayName: { type: String },
  isVerified: { type: Boolean, default: false },
});

export default  mongoose.model("users", UserSchema);
