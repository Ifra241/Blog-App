import { Document, model, models, Schema, Types } from "mongoose";


export interface Notification extends Document{
    user:Types.ObjectId;
    message:string;
    read:boolean;
    createdAt:Date;
}

const NotificationSchema=new Schema<Notification>({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    message:{
        type:String,
        required:true,
},
  read:{
    type:Boolean,
    default:false,
  },
  createdAt:{
     type: Date, 
     default: Date.now 
  },
});
const Notification=models.Notification||model<Notification>("Notification",NotificationSchema);
export default Notification;