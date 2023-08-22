import { IUser } from "@/types";
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema<IUser>({
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
type IUserDocument = IUser & mongoose.Document;
type IUserModel = mongoose.Model<IUserDocument>;

const User:IUserModel = mongoose.models.users || mongoose.model<IUserDocument, IUserModel>("users", UserSchema)
export default  User ;
