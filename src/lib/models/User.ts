import { model, models, Schema,Document } from "mongoose";

export interface User extends Document{

    fullname:string;
    email:string;
    password?:string;
    profilePic ?:string;
    authType:"email"|"google";
      createdAt: Date;
      followers:string[];
      following:string[];

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
    authType:{
        type:String,
        enum:["email","google"],
        required:true,
    },
    createdAt:{
         type: Date,
    default: Date.now,
    },
    followers:{
        type:[String],
        default:[],
    },
    following:{
        type:[String],
        default:[],
    }
});
const User=models.User||model("User",UserSchema);
export default User;