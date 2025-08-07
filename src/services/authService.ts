import axios from "axios";



interface SignupData {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: File|null; }

export async function signupUser(data: SignupData) {
  try {
    let imageUrl = "";

    if (data.image) {
      const formData = new FormData();
      formData.append("file", data.image);
      formData.append("upload_preset", "unsigned_preset");
      formData.append("folder", "profile-image");

      const res = await fetch("https://api.cloudinary.com/v1_1/detopi9nv/image/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      imageUrl = result.secure_url;
    }

    const response = await axios.post("/api/auth/signup", {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      image: imageUrl,
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
        return res.data;
    }catch(error){
        console.error("Login Error:",error);
        throw error;
    }
}
