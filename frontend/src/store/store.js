import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import issueReducer from './issueSlice';
import commentReducer from './commentSlice';
import spaceReducer from './spaceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    issues: issueReducer,
    comments: commentReducer,
    spaces: spaceReducer,
  },
});

export default store;