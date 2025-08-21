import mongoose, { Document, Model, Schema } from "mongoose";

export interface BlogProp extends Document {
  title: string;
  content: string;
  category:string;
  image: {
    public_id: string;
    folder: string;
    secure_url: string;
  };
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Delete cached model to avoid old schema issues
delete mongoose.models.Blog;

const BlogSchema: Schema<BlogProp> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category:{
      type:String,
      required:true,
    },
    image: {
      public_id: { type: String, required: true },
      folder: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Blog: Model<BlogProp> = mongoose.model<BlogProp>("Blog", BlogSchema);

export default Blog;
