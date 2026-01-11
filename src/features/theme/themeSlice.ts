import { createSlice } from "@reduxjs/toolkit";


//define the state shape

interface ThemeState {
    mode: 'light' | 'dark';
}

//define the initial state
const initialState:ThemeState =  {
    mode: 'light'
}

//create the slice (actions, reducers)

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode==='light' ? 'dark':'light';
        }
    }
})

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;