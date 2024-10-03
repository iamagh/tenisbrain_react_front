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



/**
 * _use
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store'; // Import your store
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);



----------------

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store'; // Import the RootState type
import { setPlayerCoach, setMemberPlayers } from './playerSlice'; // Import actions

const PlayerComponent = () => {
  const dispatch = useDispatch();
  const playerCoach = useSelector((state: RootState) => state.player.playerCoach);
  const memberPlayers = useSelector((state: RootState) => state.player.memberPlayers);

  const [newCoach, setNewCoach] = useState('');
  const [newPlayers, setNewPlayers] = useState<string[]>([]);

  // Function to handle adding a coach
  const handleSetCoach = () => {
    dispatch(setPlayerCoach(newCoach));
  };

  // Function to handle adding member players
  const handleSetPlayers = () => {
    dispatch(setMemberPlayers(newPlayers));
  };

  return (
    <div>
      <h1>Player Info</h1>
      <p>Current Coach: {playerCoach}</p>
      <p>Players: {memberPlayers.join(", ")}</p>

      {/* Set Player Coach */}
      <input 
        type="text" 
        value={newCoach} 
        onChange={(e) => setNewCoach(e.target.value)} 
        placeholder="Enter new coach"
      />
      <button onClick={handleSetCoach}>Set Coach</button>

      {/* Set Member Players */}
      <input 
        type="text" 
        value={newPlayers.join(", ")} 
        onChange={(e) => setNewPlayers(e.target.value.split(","))} 
        placeholder="Enter players (comma-separated)"
      />
      <button onClick={handleSetPlayers}>Set Players</button>
    </div>
  );
};

export default PlayerComponent;






