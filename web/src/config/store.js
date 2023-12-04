import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import * as resourceReducers from './resourceReducers';

// only use logger in development
const middlewares = []
if(process.env.NODE_ENV === `development`) {
  middlewares.push(logger)
}

export const initStore = (loggedInUser = null) => configureStore({
  reducer: rootReducer
  , middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares)
  , preloadedState: {
    auth: {
      // set loggedInUser as preloaded state so the store is created before any auth checks occur.
      loggedInUser: loggedInUser && loggedInUser._id ? loggedInUser : null
      , status: "idle"
      , error: null
    }
  }
})

const rootReducer = (state, action) => {
  // clear store on logout, also on login so any previous rejected queries are cleared out.
  // adapted from https://stackoverflow.com/a/61943631
  if(action.type === 'auth/sendLogout/fulfilled' || action.type === 'auth/sendLogout/rejected' || action.type === 'auth/sendLogin/fulfilled') {
    state = undefined
  }
  return combinedReducers(state, action)
}

const combinedReducers = combineReducers({
  ...resourceReducers
})