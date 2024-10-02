import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
    playerCoach: string;
    memberPlayers: []
}

const initialState: PlayerState = {
    playerCoach: '',
    memberPlayers: []
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

        

    }
});

export const { setPlayerCoach, setMemberPlayers } = playerSlice.actions;
export default playerSlice.reducer;
