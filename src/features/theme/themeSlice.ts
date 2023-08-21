import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Theme = "light" | "dark";
const localTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") : 'dark';
const html = typeof document !== 'undefined' ? document.querySelector("html") : null;
interface ThemeState  {
    theme: Theme;
  };
const initialState: ThemeState = {
 theme:  (localTheme || 'dark') as Theme
}
function applyTheme(theme:Theme) {
  if(html){
    html.className = theme === 'dark' ? 'dark' : ''
  }
}
type setThemeAction ={
  type: string,
  payload: Theme
}
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
   setTheme: (state,action:setThemeAction)=> {
        const newTheme = action.payload === 'dark' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        state.theme = newTheme;
   },
   initializeTheme: (state) => {
      applyTheme(state.theme);
   }
  },
})

// Action creators are generated for each case reducer function
export const { setTheme, initializeTheme } = themeSlice.actions
export const theme = (state: ThemeState) => state.theme;
export default themeSlice.reducer