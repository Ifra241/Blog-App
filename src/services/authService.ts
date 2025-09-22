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
      const formData = new FormData();
      formData.append("file", data.profilePic);
      formData.append("type", "user");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadRes.json();
      if (uploadResult.error) throw new Error(uploadResult.error.message);

      imageUrl = uploadResult.secure_url;
    }

    // user data profilePic URL in DB
    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        profilePic: imageUrl,
      }),
    });

    if (!signupRes.ok) {
      const errorData = await signupRes.json();
      throw new Error(errorData.message || "Signup failed");
    }

    return await signupRes.json();
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
}

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(data: LoginData) {
  try {
    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!loginRes.ok) {
      const errorData = await loginRes.json();
      throw new Error(errorData.message || "Login failed");
    }

    const result = await loginRes.json();

    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}
