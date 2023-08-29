import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";

export interface Profile {
    _id:string;
    username: string;
    email:string;
    joinedAt: Date | string;
    bio:string;
    profileImgUrl?: string;
    profileCoverUrl?: string;
    displayName: string;
    isVerified: boolean;
    followers: string[];
    following: string[];
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
        isVerified: true,
        joinedAt: '20-12-2023',
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
        }
    }
});
export const {setUser, toggleFollow} = UserSlice.actions;
export const selectUser = (state:RootState) => state.user.user;
export default UserSlice.reducer;