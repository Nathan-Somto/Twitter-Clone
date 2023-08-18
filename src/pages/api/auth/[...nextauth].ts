import NextAuth, {Awaitable, DefaultSession, NextAuthOptions,User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import userModel from "@/lib/models/user.model";
import connectDb from "@/lib/config/connectDb";
import generateUsername from "@/lib/utils/generateUsername"
import { JWT } from "next-auth/jwt";
import {CustomSession} from '@/types'


// custom params to have extended session data.
type Params = {
  session: CustomSession;
  token: JWT;
  user: User;
} & {
  newSession: any;
  trigger: "update";
}


export const authOptions:NextAuthOptions = {
    pages:{
        signIn: "/sign-in",
        newUser:"/onboarding",
        signOut: "/sign-in",

    },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID  as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      checks: ["none"],
    })
  ],
  callbacks: {
    async session({session, token}:Params): Promise<CustomSession | DefaultSession> {
      // called whenever we use the useSession hook gets data from the token
      if(!session.user) return session;
      if(token){
        session.user.id = token.id as unknown as  string;
        session.user.username = token.username as unknown as  string
        session.user.onBoarded = token.onBoarded as unknown as boolean
        session.user.image = token.image  as unknown as string
      }
      return session;
    },
    async jwt({ token, user }) {
      // creates the jwt called during the sign in process.
      if (user) {
        connectDb();
        const existingUser = await userModel.findOne({ email: user.email });
        // checks if we have an existing user then prefill content.
        if (existingUser) {
          token.id = existingUser._id.toString();
          token.username = existingUser.username;
          token.onBoarded = existingUser.onBoarded
          token.image = existingUser.profileImgUrl;
        } else {
          // creates user in mongodb and then prefills content
          const newUser = await userModel.create({
            email: user.email,
            onBoarded: false,
            profileImgUrl: user.image,
            displayName: user.name,
            username: generateUsername(user.name as string),
          });

          token.id = newUser._id.toString();
          token.username = newUser.username;
          token.onBoarded = false;
          token.image = newUser.profileImgUrl;
        }
      }

      return token;
    },
    redirect({ url, baseUrl }) {
      return "/home";
    },
    },
    session: {
      strategy: 'jwt'
  },
  jwt: {
    secret: process.env.JWT_SECRET as string
  },
  }
  
  


export default NextAuth(authOptions)