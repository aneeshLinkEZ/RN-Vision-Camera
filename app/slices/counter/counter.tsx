import { createSlice } from "@reduxjs/toolkit";


const initialState: CounterState = {
    counter: 0
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        setIncrement: (state, action) => {
            state.counter = action.payload;
        },
        setDecrement: (state, action) => {
            state.counter = action.payload;
        }
    }
})

export const { setIncrement, setDecrement } = counterSlice.actions

export default counterSlice.reducer