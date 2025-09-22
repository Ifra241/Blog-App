"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/services/profileService";
import { toast } from "sonner";
import { mutate } from "swr";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    _id: string;
    fullname: string;
    bio?: string;
    profilePic?: string;
     profilePicPublicId?: string;
  };
}

export function EditProfileDialog({ open, onClose, user }: EditProfileDialogProps) {
  const [fullname, setFullname] = useState(user.fullname || "");
  const [bio, setBio] = useState(user.bio || "");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch=useDispatch();


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    //  Default (agar user image change nahi karta)
    let profilePicData = {
      secure_url: user.profilePic || "",
      public_id: user.profilePicPublicId || "",
    };

    //  If new image selected 
    if (profilePic) {
      const formData = new FormData();
      formData.append("file", profilePic);
      formData.append("type", "user");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadRes.json();
      if (uploadResult.error) throw new Error(uploadResult.error.message);

      profilePicData = {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    //  Send to backend
    const updatedUser = await updateProfile(user._id, {
      fullname,
      bio,
      profilePic: profilePicData,
    });

    mutate(`/api/user/${user._id}`);
    dispatch(setUser(updatedUser));
    toast.success("Profile updated successfully");
    onClose();
  } catch (error) {
    console.error(error);
    toast.warning("Failed to update profile");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />

          <Textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
