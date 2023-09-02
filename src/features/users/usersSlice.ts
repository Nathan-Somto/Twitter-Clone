import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";

export interface Profile {
    _id:string;
    username: string;
    email:string;
    joinedAt: string;
    bio:string;
    profileImgUrl?: string;
    profileCoverUrl?: string;
    displayName: string;
    isVerified: boolean;
    followers: string[];
    following: string[];
    tweets:string[];
}
type UserState =  {
    user: Profile;
}
type SetUserAction = {
    type: string;
    payload: Profile;
}
type ToggleFollowAction = {
    type: string;
    payload:{
        remove:boolean,
        _id: string,
    }
}
const initialState:UserState = {
    user: {
        _id: '1234',
        bio: "i love coding",
        displayName: "Nathan Somto",
        email: "nturner560@gmail.com",
        followers: [],
        following: [],
        tweets:[],
        isVerified: true,
        joinedAt: '2023-01-1T00:00:00.000Z',
        username: 'nathan-somto',
        profileCoverUrl: undefined,
        profileImgUrl: undefined
    }
}
const UserSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser: (state, action:SetUserAction) => {
            state.user = action.payload;
        },
        toggleFollow: (state, action:ToggleFollowAction) => {
            const {_id, remove} = action.payload;
            if(remove){
                state.user.following = state.user.following.filter((follow_id) => follow_id !== _id);
            }
            else {
                state.user.following.unshift(_id);
            }
        },
        toggleFollowers: (state, action:ToggleFollowAction) => {
            const {_id, remove} = action.payload;
            if(remove){
                state.user.followers = state.user.followers.filter((follower_id) => follower_id !== _id);
            }
            else {
                state.user.followers.unshift(_id);
            }
        }
    }
});
export const {setUser, toggleFollow, toggleFollowers} = UserSlice.actions;
export const selectUser = (state:RootState) => state.user.user;
export default UserSlice.reducer;