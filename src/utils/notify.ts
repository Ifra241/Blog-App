
export async function createNotification(userId: string, message: string){
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    if(!userId||!message)return;

    await fetch(`${BASE_URL}/api/notifications/create`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({userId,message}),
    });
}