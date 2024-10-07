import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { _Coach } from "dataTypes/Player";
interface PlayerState {
    playerCoach: _Coach;
    memberPlayers: [];
    allEvents: [],
    dialogState: ""
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
    allEvents: [],
    dialogState: ""
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayerCoach: (state, action: PayloadAction<any>) => {
            state.playerCoach = action.payload;
            console.log("^^^^^^^^^^^^^^^^", action.payload)
        },

        setMemberPlayers: (state, action: PayloadAction<any>) => {
            state.memberPlayers = action.payload;
        },

        setAllEvents: (state, action: PayloadAction<any>) => {
            state.allEvents = action.payload;
        },
        setDialogState: (state, action: PayloadAction<any>) => {
            state.dialogState = action.payload;
        },

    }
});

export const { setPlayerCoach, setMemberPlayers, setAllEvents, setDialogState } = playerSlice.actions;
export default playerSlice.reducer;
