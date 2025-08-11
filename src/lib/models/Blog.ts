import mongoose, { Document, Model, Schema } from "mongoose";


export interface BlogProp extends Document{
    title:string;
    content:string;
    author:string;
    createdAt:Date;
    updatedAt:Date;
}

const BlogSchema:Schema<BlogProp>=new Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,


        },
        content:{
            type:String,
            required:true,
        },
        author:{
            type:String,
            required:true,
        },
    },
            { timestamps:true}

);
const Blog:Model<BlogProp>=mongoose.models.Blog||mongoose.model<BlogProp>("Blog",BlogSchema);
export default Blog;