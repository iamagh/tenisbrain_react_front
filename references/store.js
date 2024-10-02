/**
 * _slice
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PlayerState {
    playerCoach: string;
    memberPlayers: string[];  // Assuming memberPlayers is an array of strings (player names or ids)
}

const initialState: PlayerState = {
    playerCoach: '',
    memberPlayers: []
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setPlayerCoach: (state, action: PayloadAction<string>) => {
            state.playerCoach = action.payload;
        },

        setMemberPlayers: (state, action: PayloadAction<string[]>) => {  // Expecting an array of strings
            state.memberPlayers = action.payload;
        }
    }
});

export const { setPlayerCoach, setMemberPlayers } = playerSlice.actions;
export default playerSlice.reducer;



/**
 * 
 * _Store
 * 
 */


import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice"; // Import the reducer

// Create the Redux store and add the reducer to it
export const store = configureStore({
    reducer: {
        player: playerReducer,
    }
});

// Define RootState and AppDispatch for better TypeScript integration
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
