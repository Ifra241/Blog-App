import mongoose, { Schema, model, models } from "mongoose";

const commentSchema = new Schema({
  blog: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "Blog", required: true 
    },
  user: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User", required: true
     },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;
