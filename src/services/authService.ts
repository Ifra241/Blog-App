import axios from "axios";

interface SignupData {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic?: File | null;
}

export async function signupUser(data: SignupData) {
  try {
    let imageUrl = "";

    if (data.profilePic) {
      const formData = new FormData();//FormData is a special browser API used to send files/data to the server in the same way a <form> would.
      formData.append("file", data.profilePic);
        formData.append("type", "user");


      // call backend route on  upload Cloudinary 
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadRes.json();
      if (uploadResult.error) throw new Error(uploadResult.error.message);

      imageUrl = uploadResult.secure_url;
    }

    //  user data profilePic URL in  DB 
    const response = await axios.post("/api/auth/signup", {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      profilePic: imageUrl,
    });

    return response.data;
  } catch (error) {
    console.error("Signup Error", error);
    throw error;
  }
}



    

interface LoginData{
    email:string;
    password:string;
}

export async function loginUser(data:LoginData){
    try{
        const res=await axios.post("/api/auth/login",data);
                if(res.data.user){
                  localStorage.setItem("user",JSON.stringify(res.data.user));

                }

        return res.data;
    }catch(error){
        console.error("Login Error:",error);
        throw error;
    }
}
