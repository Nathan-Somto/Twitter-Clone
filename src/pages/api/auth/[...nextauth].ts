import NextAuth, { NextAuthOptions,User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import userModel from "@/lib/models/user.model";
import connectDb from "@/lib/config/connectDb";
import generateUsername from "@/lib/utils/generateUsername"


interface CustomNextAuthUser extends User {
  onBoarded?: boolean;
  username?: string;
}



export const authOptions:NextAuthOptions = {
    pages:{
        signIn: "/sign-in",
        newUser:"/onboarding"
    },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID  as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async signIn({user})
    {
        connectDb();
        const existingUser = await userModel.findOne({ email: user.email });
        if (existingUser) {
            user.id = existingUser._id as unknown as string; 
            // if we have a user and not onboarded create a username and redirect to onboarding
            if(!existingUser.onBoarded){
                existingUser.username = generateUsername(user.name as string);
                (user as CustomNextAuthUser).username = existingUser.username;
                return "/onboarding";
            }
            return true; 
        } else {
            // Create the new user in your database
            const newUser = await userModel.create({
                email: user.email,
                onBoarded: false,
                profileImgUrl: user.image,
                displayName:user.name,
                username: generateUsername(user.name  as string),
            });
            user.id = newUser._id  as unknown as string; 
            (user as CustomNextAuthUser).username= newUser.username;
            return "/onboarding"; 
        }
    },
    },
    session: {
        strategy: 'jwt'
    },
    jwt: {
      secret: process.env.JWT_SECRET as string, // Specify your JWT secret here
    }
}

export default NextAuth(authOptions)