
export async function toggleLike(blogId: string, userId: string,currentUserName: string){
    try{
        const res =await fetch(`/api/blogs/${blogId}/like`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({userId,currentUserName}),
        });
       
        const data=await res.json();


        if(!res.ok){
            throw new Error(data.message || "Error liking blog");
            
            

        }

        return data;
    }catch(error){
         console.error("toggleLike error:", error);
    throw error;

    }
    }
