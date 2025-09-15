import useSWR from "swr";


//Post Comment
export async function addComment(blogId:string,userId:string,content:string){

    try{
        const res=await fetch("/api/comments",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
                  body: JSON.stringify({ blogId, userId, content}),

        });
        if(!res.ok){
            const errorData=await res.json();
            throw new Error(errorData.message || "Failed to add comment");
        }
        return await res.json();
    }catch(error){
        console.error("Failed to post coment",error)
    }

}
//Get Comment

export async function fetcher(url:string){
    const res=await fetch(url);
    if(!res.ok) throw new Error("Failed to fetch Comment");
    return res.json();
    }

    export  function useComments(blogId:string){
        const{data,error,mutate}=useSWR(blogId?`/api/comments?blogId=${blogId}` : null, fetcher);

        return{
            comments:data,
            isLoading:!error &&!data,
            isError:error,
            mutate,

    };
    
}

// Delete comment
export async function deleteComment(commentId: string) {
  try {
    const res = await fetch(`/api/comments?commentId=${commentId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete comment");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

// Edit comment
export async function editComment(commentId: string, content: string) {
  try {
    const res = await fetch(`/api/comments`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, content }),
    });
    if (!res.ok) throw new Error("Failed to edit comment");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
