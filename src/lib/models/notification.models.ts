import { INotification } from "@/types";
import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema<INotification>({
  parentUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  message: { type: String, required: true, enum: ['followed', 'liked', 'commented', 'retweeted']},
  actionUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  tweetId: { type: mongoose.Schema.Types.ObjectId, ref: "tweets" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
});

type INotificationDocument = INotification & mongoose.Document;
type INotificationModel = mongoose.Model<INotificationDocument>;
const Notifications: INotificationModel =
  mongoose.models.notifications ||
  mongoose.model("notifications", NotificationSchema);
export default Notifications;
