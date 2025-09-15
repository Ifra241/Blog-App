export interface User {
  _id: string;
  username: string;
  fullname: string;
   bio?:string;
  profilePic?: string;
  followers: string[];
  following: string[];
}

export interface Blog {
  _id: string;
title: string;
  description: string;
  category: string;
  image?: {
    public_id: string;
    folder: string;
    secure_url: string;
  };
  createdAt: string;
  content: string;
}

