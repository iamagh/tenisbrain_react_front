import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice";
import coachSlice from "./coachSlice";
import playerSlice from "./playerSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        coach: coachSlice,
        player: playerSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch