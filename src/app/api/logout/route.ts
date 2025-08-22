import { NextResponse } from "next/server";


export async function GET(){
    try{
    const response=NextResponse.json({message:"Logged out"});
    response.cookies.set("token","",{path:"/",maxAge:0})
    
    return response;
    } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong during logout" },
      { status: 500 }
      );
      }
}