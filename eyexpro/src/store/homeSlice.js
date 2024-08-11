import { createSlice } from '@reduxjs/toolkit'
                           

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
     url: {},
     genres: {},
     token: null
  },
  reducers: {
     getApiConfiguration: (state, action) => {
     state.url = action.payload;
     },

     getGenres: (state, action) => {
     state.genres = action.payload;
     },
     setToken: (state, action) => {
       state.token = action.payload;
       },
       clearToken: (state) => {
         state.token = null
         }

  },
})

// Action creators are generated for each case reducer function
export const { getApiConfiguration,getGenres , setToken , clearToken } = homeSlice.actions

export default homeSlice.reducer