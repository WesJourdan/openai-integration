import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import apiUtils from '../../global/utils/api';

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const sendRegister = createAsyncThunk(
  'auth/sendRegister'
  , async (userInfo) => {
    const response = await apiUtils.callAPI('/api/users/register', 'POST', userInfo);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const sendLogin = createAsyncThunk(
  'auth/sendLogin'
  , async (userInfo) => {
    const response = await apiUtils.callAPI('/api/users/mobile-login', 'POST', userInfo);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const sendLogout = createAsyncThunk(
  'auth/sendLogout'
  , async () => {
    const response = await apiUtils.callAPI('/api/users/logout', 'POST');
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const sendGetLoggedIn = createAsyncThunk(
  'auth/sendGetLoggedIn'
  , async () => {
    const response = await apiUtils.callAPI('/api/users/get-logged-in', 'POST');
    return response
  }
);

export const authStore = createSlice({
  name: 'auth'
  , initialState: {
    loggedInUser: null
    , status: 'idle'
    , error: null
  }
  // The `reducers` field lets us define reducers and generate associated actions
  , reducers: {
    // none needed here
  }
  // The `extraReducers` field lets the store handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other stores.
  , extraReducers: (builder) => {
    builder
      .addCase(sendRegister.pending, (state) => {
        state.status = 'pending';
        state.error = null
      })
      .addCase(sendRegister.fulfilled, (state, {payload}) => {
        if(payload) {
          state.status = 'idle';
          state.loggedInUser = payload;
        } else {
          state.status = 'rejected'
          state.error = payload.message || 'failed register'
        }
      })
      .addCase(sendRegister.rejected, (state, {error}) => {
        state.status = 'rejected'
        state.error = error
      })
      .addCase(sendLogin.pending, (state) => {
        state.status = 'pending';
        state.error = null
      })
      .addCase(sendLogin.fulfilled, (state, {payload}) => {
        if(payload.success) {
          state.status = 'idle';
          state.loggedInUser = payload.user;
          state.token = payload.token; 
        } else {
          state.status = 'rejected'
          state.error = payload.message || 'failed login'
        }
      })
      .addCase(sendLogin.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error
      })
      .addCase(sendLogout.pending, (state) => {
        state.status = 'pending';
        state.error = null
      })
      .addCase(sendLogout.fulfilled, (state) => {
        state.status = 'idle';
        state.loggedInUser = null
        state.token = null 
      })
      .addCase(sendLogout.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.error
      })
      .addCase(sendGetLoggedIn.pending, (state) => {
        state.status = 'pending';
        state.error = null
      })
      .addCase(sendGetLoggedIn.fulfilled, (state, {payload: loggedInUser}) => {
        state.status = 'fulfilled';
        state.loggedInUser = loggedInUser;
      })
      .addCase(sendGetLoggedIn.rejected, (state, {error}) => {
        state.status = 'rejected'
        state.error = error
      })
  }
});





// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
/**
 * 
 * @returns logged in user object
 */
export const selectLoggedInUser = ({ auth }) => {
  return auth.loggedInUser;
}

/**
 * 
 * @returns logged in user fetch status
 */
export const selectAuthStatus = ({ auth }) => {
  return auth.status
}

/**
 * 
 * @returns login token 
 */
export const selectSessionToken = ({ auth }) => {
  return auth.token
}

export default authStore.reducer;

