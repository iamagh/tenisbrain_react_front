import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: any;
    userRole: string;
    accessToken: string;
    refreshToken: string;
    playerCoach: any;
    userInformation: any;
}

const initialState: UserState = {
    user: 0,
    userRole: '',
    accessToken: '',
    refreshToken: '',
    playerCoach: 0,
    userInformation: {},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<any>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
            state.userRole = action.payload.role;
            state.playerCoach = action.payload.player_coach;
            state.userInformation = action.payload.user_info;
        },
        setPlayerCoach: (state, action: PayloadAction<any>) => {
            state.playerCoach = action.payload;
            state.refreshToken = state.refreshToken;
            state.accessToken = state.accessToken;
            state.userRole = state.userRole;
            state.user = state.user;
            state.userInformation = state.userInformation;
        },
        removeAuthData: (state) => {
            state = {
                user: 0,
                playerCoach: 0,
                userRole: '',
                accessToken: '',
                refreshToken: '',
                userInformation: '',
            }
            // reset localstorage when logout
        }
    }
})

export const {setAuthData, removeAuthData, setPlayerCoach} = userSlice.actions;
export default userSlice.reducer;
