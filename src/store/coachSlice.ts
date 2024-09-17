import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CoachState {
    availabilitys: [];
    content: [];
    groupClass: [];
    date: string;
}

const initialState = {
    availabilitys: [],
    date: new Date().toDateString(),
    groupClass: [],
    content: [],
}

export const coachSlice = createSlice({
    name: "coach",
    initialState,
    reducers: {
        setCoachAvailabilitys: (state, action: PayloadAction<any>) => {
            state.availabilitys = action.payload;
        },
        setContent: (state, action: PayloadAction<any>) => {
            state.content = action.payload; 
        }
    }
});

export const { setCoachAvailabilitys, setContent } = coachSlice.actions;
export default coachSlice.reducer;
