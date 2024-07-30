

// Store: Created with createStore and combined reducers. It holds the state tree of the application.

// Actions: Define what can happen in the app (increment or decrement the counter).

// Reducers: Specify how the state changes in response to actions. The counterReducer updates the count based on the action type.

// Provider: Makes the Redux store available to the rest of the app.

// useSelector: Extracts the count state from the store.

// useDispatch: Dispatches actions to the store to update the state

// createSlice helps simplify creating a Redux slice, which includes the state, reducers, and actions for a specific part of your app.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: "",
    onlineUser : [],
    socketConnection : null
}

export const userSlice = createSlice({
    // name: This is the name of the slice, which is 'user' in this case.
    // initialState: This is the initial state object we defined earlier.
    // reducers: This is an object where we define how the state should change in response to actions.
    name: 'user',
    initialState,
    reducers: {
        // This reducer updates the user state with the data provided in the action's payload.
        setUser: (state,action) => {
            state._id = action.payload._id
            state.name =  action.payload.name
            state.email =  action.payload.email
            state.profile_pic=  action.payload.profile_pic
        },
        // This reducer updates the token property with the value provided in the action's payload.
        setToken: (state,action) => {
            state.token = action.payload
        },
        // This reducer clears the user's data by resetting _id, name, email, and profile_pic to empty strings.
        logout: (state,action) => {
            state._id = ""
            state.name = ""
            state.email = ""
            state.profile_pic= ""
            state.token = ""
            state.socketConnection = null
        },
        setOnlineUser : (state,action) => {
            state.onlineUser = action.payload;
        },
        setSocketConnection :(state , action) => {
            state.socketConnection = action.payload;
        }

    },
})

export const { setUser , setToken , logout , setOnlineUser , setSocketConnection } = userSlice.actions;

export default userSlice.reducer 

















