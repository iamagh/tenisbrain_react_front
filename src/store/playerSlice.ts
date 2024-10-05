import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { _Coach } from "dataTypes/Player";
interface PlayerState {
    playerCoach: _Coach;
    memberPlayers: [];
    allEvents: []
}

const initialState: PlayerState = {
    playerCoach: {
        id: 0,
        first_name: "",
        last_name: "",
        gender: "",
        club_name: "",
        club_address: "",
        qualification: "",
        profile_image: "",
        email: "",
        phone_no: "",
        bio: ""
    },
    memberPlayers: [],
    allEvents: []
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayerCoach: (state, action: PayloadAction<any>) => {
            state.playerCoach = action.payload;
        },

        setMemberPlayers: (state, action: PayloadAction<any>) => {
            state.memberPlayers = action.payload;
        },

        setAllEvents: (state, action: PayloadAction<any>) => {
            state.allEvents = action.payload;
        },

        

    }
});

export const { setPlayerCoach, setMemberPlayers, setAllEvents } = playerSlice.actions;
export default playerSlice.reducer;
