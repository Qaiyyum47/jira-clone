import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  spaces: [],
  currentSpace: null,
  spaceMembers: [],
  loading: false,
  error: null,
};

export const getSpaceMembers = createAsyncThunk(
  'spaces/getSpaceMembers',
  async (spaceId, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await api.get(`/spaces/${spaceId}/members`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createSpace = createAsyncThunk('spaces/createSpace', async (spaceData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await api.post('/spaces', spaceData, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getAllSpaces = createAsyncThunk('spaces/getAllSpaces', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await api.get('/spaces', config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addMemberToSpace = createAsyncThunk(
  'spaces/addMemberToSpace',
  async ({ spaceId, email }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data } = await api.post(`/spaces/${spaceId}/members`, { email }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSpaceById = createAsyncThunk(
  'spaces/getSpaceById',
  async (spaceId, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await api.get(`/spaces/${spaceId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const spaceSlice = createSlice({
  name: 'spaces',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.spaces.push(action.payload);
      })
      .addCase(createSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllSpaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.spaces = action.payload;
      })
      .addCase(getAllSpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSpaceMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpaceMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.spaceMembers = action.payload;
      })
      .addCase(getSpaceMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.spaceMembers = [];
      })
      .addCase(addMemberToSpace.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMemberToSpace.fulfilled, (state, action) => {
        state.loading = false;
        state.spaceMembers = action.payload;
      })
      .addCase(addMemberToSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSpaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpaceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpace = action.payload;
        state.spaceMembers = action.payload.members;
      })
      .addCase(getSpaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentSpace = null;
        state.spaceMembers = [];
      });
  },
});

export default spaceSlice.reducer;
