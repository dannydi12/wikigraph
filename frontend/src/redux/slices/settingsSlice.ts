import { createSlice } from '@reduxjs/toolkit'

type InitialState = {
  theme: 'dark' | 'light'
}

const initialState: InitialState = {
  theme: 'light'
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    }
  }
})

export const { toggleTheme } = settingsSlice.actions
export default settingsSlice.reducer
