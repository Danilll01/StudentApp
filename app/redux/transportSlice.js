import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import VTkey from '../APIKey.js';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    loading: false,
    id: null,
    VTtoken: null,
    expiry: Date.now(),
    error: ''
}

export const generateToken = createAsyncThunk('transport/VTtoken', async () => {
    const id = uuidv4();
    const res = await axios
        .post(
            "https://api.vasttrafik.se/token",
        qs({
            grant_type: "client_credentials",
            scope: id
        }),
        {
            headers: {
            "Authorization": `Basic ${VTkey}`,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/x-www-form-urlencoded;"
            }
        }
    );

    console.log("done")
    return {
        id,
        expiry: new Date().getTime() + res.data.expires_in * 1000,
        ...res.data
    };
})

export const transportSlice = createSlice({
  name: 'transport',
  initialState,
  extraReducers: {
    [generateToken.pending]: (state) => {
        return {
            ...state,
            loading: true,
            error: ''
        }
    },
    [generateToken.fulfilled]: (state, action) => {
        return {
            ...state,
            loading: false,
            id: action.payload.id,
            VTtoken: action.payload.access_token,
            expiry: action.payload.expiry
        }
    },
    [generateToken.rejected]: (state, action) => {
        return {
            ...state,
            loading: false,
            error: action.error.message
        }
    }

  },
  
})

export const getVTtoken = state => {
    return state.persistedReducer.transport
};

export default transportSlice.reducer;