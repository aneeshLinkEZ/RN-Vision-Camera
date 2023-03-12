import { createSlice } from "@reduxjs/toolkit";


const initialState: ImageState = {
    image: []
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        addImage: (state, action) => {
            console.log("payLoad = ", action.payload);
            
            // state.image = action.payload;
        }
    }
})

export const { addImage } = imageSlice.actions

export default imageSlice.reducer