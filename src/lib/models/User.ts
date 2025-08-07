import { model, models, Schema } from "mongoose";



const UserSchema=new Schema({
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