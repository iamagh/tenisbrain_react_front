import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
    playerCoach: string;
}

const initialState: PlayerState = {
    playerCoach: '',
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayerCoach: (state, action: PayloadAction<any>) => {
            state.playerCoach = action.payload;
        }
    }
});

export const { setPlayerCoach } = playerSlice.actions;
export default playerSlice.reducer;
