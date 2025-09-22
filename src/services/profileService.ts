
export interface UpdateProfileData {
  fullname?: string;
  bio?: string;
  profilePic?: {
    secure_url: string;
    public_id: string;
  };
}

export async function updateProfile(userId: string, data: UpdateProfileData) {
  try {
    const res = await fetch(`/api/users/${userId}/update-profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || "Failed to update profile");

    return responseData.user;
  } catch (error) {
    console.error("Error in updateProfile service:", error);
    throw error;
  }
}
