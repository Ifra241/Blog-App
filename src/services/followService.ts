import { FollowBody } from "@/app/api/users/follow/route"

export const toggleFollow=async({targetUserId,currentUserId,action}:FollowBody)=>{
try{
console.log("Follow API call:", { targetUserId, currentUserId, action });
const res=await fetch("/api/users/follow",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({targetUserId,currentUserId,action})
});
const data=await res.json();
if(!res.ok)throw new Error(data.message||"Error in follow");
return data;
}catch(error){
console.error(error,"Error Occur ");
throw error
}
};