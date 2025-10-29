import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// Async Thunks
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ issueId, text }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.post(`/api/issues/${issueId}/comments`, { text }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getComments = createAsyncThunk(
  'comments/getComments',
  async (issueId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.get(`/api/issues/${issueId}/comments`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, text }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.put(`/api/comments/${id}`, { text }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await api.delete(`/api/comments/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.comments.push(payload);
      })
      .addCase(createComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.comments = payload;
      })
      .addCase(getComments.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.comments.findIndex((c) => c._id === payload._id);
        if (index !== -1) {
          state.comments[index] = payload;
        }
      })
      .addCase(updateComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.comments = state.comments.filter((c) => c._id !== payload);
      })
      .addCase(deleteComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default commentSlice.reducer;