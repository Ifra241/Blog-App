import axios from "axios";



interface SignupData {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic ?: File|null; }

export async function signupUser(data: SignupData) {
  try {
    let imageUrl = "";

    if (data.profilePic ) {
      const formData = new FormData();
      formData.append("file", data.profilePic );
      formData.append("upload_preset", "unsigned_preset");
      formData.append("folder", "profile-image");

      const res = await fetch("https://api.cloudinary.com/v1_1/detopi9nv/image/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Cloudinary Upload Result:", result);

      imageUrl = result.secure_url;
    }

    const response = await axios.post("/api/auth/signup", {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      profilePic : imageUrl,
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
