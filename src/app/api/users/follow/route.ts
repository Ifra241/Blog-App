import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { Types } from "mongoose";
import { NextResponse } from "next/server";


interface FollowBody {
  targetUserId: string;
  currentUserId: string;
  action: "follow" | "unfollow";
}
export async function POST(req:Request){

    try{
        await connectToDatabase();
        const{targetUserId,currentUserId,action}=(await req.json()) as FollowBody;

        if(!targetUserId||!currentUserId){
            return NextResponse.json({message:"Missing User IDs"},{status:400});
        }
        const targetUser=await User.findById(targetUserId);
        const currentUser=await User.findById(currentUserId);
        if(!targetUser||!currentUser){
            return NextResponse.json({message:"User Not Found"},{status:404});
        }
        //
        if(action==="follow"){
        if(!targetUser.followers.includes(currentUserId)){
            targetUser.followers.push(currentUserId);
                  currentUser.following.push(targetUserId);
                  }

                 } else if(action==="unfollow"){
                    targetUser.followers=targetUser.followers.filter(
                        (id:Types.ObjectId|string)=>id.toString()!==targetUserId
                    );

                  }
                   await targetUser.save();
      await currentUser.save();

      //
       const populatedTarget=await User.findById(targetUserId).select("-password");
       const populatedCurrent=await User.findById(currentUserId).select("-password");


    return NextResponse.json({
      message: action === "follow" ? "Followed successfully" : "Unfollowed successfully",
      followers: populatedTarget?.followers || [],
      following: populatedCurrent?.following || [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

        
        
    
