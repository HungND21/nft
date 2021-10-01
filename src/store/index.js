import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import customizationReducer from './customizationSlice';
import metamaskReducer from './metamaskSlice';
const store = configureStore({
  reducer: {
    customization: customizationReducer,
    metamask: metamaskReducer,
    user: userReducer
  }
});
export default store;
