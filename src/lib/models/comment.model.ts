import { IComment } from "@/types";
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema<IComment>({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  text: { type: String, maxlength: 280, required: true },
  createdAt: { type: Date, default: Date.now() },
  tweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tweets",
    required: true,
  },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
});

type ICommentDocument = IComment & mongoose.Document;
type ICommentModel = mongoose.Model<ICommentDocument>;
const Comments: ICommentModel =
  mongoose.models.comments || mongoose.model("comments", CommentSchema);
export default Comments;
