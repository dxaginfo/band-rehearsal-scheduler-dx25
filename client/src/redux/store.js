import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bandsReducer from './slices/bandsSlice';
import rehearsalsReducer from './slices/rehearsalsSlice';
import venuesReducer from './slices/venuesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    bands: bandsReducer,
    rehearsals: rehearsalsReducer,
    venues: venuesReducer,
  },
});

export default store;