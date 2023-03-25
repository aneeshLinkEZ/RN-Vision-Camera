import { createSlice } from "@reduxjs/toolkit";


const initialState: BluetoothState = {
    counter: 0
}

export const bluetoothSlice = createSlice({
    name: 'bluetooth',
    initialState,
    reducers: {
        setDevice: (state, action) => {
            state.bluetooth = action.payload;
        }
    }
})

export const { setDevice } = bluetoothSlice.actions

export default bluetoothSlice.reducer