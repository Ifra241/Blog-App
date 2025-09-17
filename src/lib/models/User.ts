import { model, models, Schema,Document,Types } from "mongoose";

export interface User extends Document{

    fullname:string;
    email:string;
    password?:string;
    profilePic ?:string;
    bio?:string;
    authType:"email"|"google";
    createdAt: Date;
    followers:Types.ObjectId[];
    following:Types.ObjectId[];
    savedBlogs:Types.ObjectId[];
    isVerified:boolean;
    verificationCode:string;
    verificationCodeExpiry?: Date;

}

const UserSchema=new Schema<User>({
    fullname:{
        type:String,
        required:true,
    
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:false,
    },
    profilePic :{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    authType:{
        type:String,
        enum:["email","google"],
        required:true,
    },
    createdAt:{
         type: Date,
    default: Date.now,
    },
    followers:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    savedBlogs:[{
        type:Schema.Types.ObjectId, 
        ref:"Blog"
    }],
    isVerified:{
        type:Boolean,
        default:false,
    },
    verificationCode:{
        type:String,
     },
     verificationCodeExpiry:{
        type:Date,
     },
});
const User=models.User||model("User",UserSchema);
export default User;