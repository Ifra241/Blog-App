import { model, models, Schema,Document } from "mongoose";

export interface User extends Document{

    fullname:string;
    email:string;
    password:string;
    image?:string;
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
        required:true,
    },
    image:{
        type:String,
        default:"",
    },
});
const User=models.User||model("User",UserSchema);
export default User;