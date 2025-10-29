import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  issues: [],
  sidebarIssues: [],
  currentIssue: null,
  suggestions: [],
  loading: false,
  error: null,
};


export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async ({ spaceId, issueData }, { getState, rejectWithValue }) => {
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

      const { data } = await api.post(`/spaces/${spaceId}/issues`, issueData, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const getIssues = createAsyncThunk(
  'issues/getIssues',
  async ({ spaceId, projectId }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      let url = `/spaces/${spaceId}/issues`;
      if (projectId) {
        url += `?projectId=${projectId}`;
      }

      const { data } = await api.get(url, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getIssueById = createAsyncThunk(
  'issues/getIssueById',
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

      const { data } = await api.get(`/issues/${issueId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ issueId, issueData }, { getState, rejectWithValue }) => {
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

      const { data } = await api.put(`/issues/${issueId}`, issueData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
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

      await api.delete(`/issues/${issueId}`, config);
      return issueId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllIssues = createAsyncThunk(
  'issues/getAllIssues',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.get('/issues', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getSidebarIssues = createAsyncThunk(
  'issues/getSidebarIssues',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.get('/issues/sidebar', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const searchIssues = createAsyncThunk(
  'issues/searchIssues',
  async (searchParams, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        params: searchParams,
      };

      
      if (config.params.project) {
        config.params.space = config.params.project;
        delete config.params.project;
      }

      const { data } = await api.get('/issues/search', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'issues/fetchSuggestions',
  async (keyword, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        params: { keyword },
      };

      const { data } = await api.get('/issues/suggestions', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'issues/createComment',
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

      const { data } = await api.post(`/issues/${issueId}/comments`, { text }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'issues/updateComment',
  async ({ issueId, commentId, text }, { getState, rejectWithValue }) => {
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

      const { data } = await api.put(
        `/issues/${issueId}/comments/${commentId}`,
        { text },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'issues/deleteComment',
  async ({ issueId, commentId }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await api.delete(`/issues/${issueId}/comments/${commentId}`, config);
      return { commentId }; 
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'issues/uploadAttachment',
  async ({ issueId, formData }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          
        },
      };

      const { data } = await api.post(`/issues/${issueId}/attachments`, formData, config);
      return data.attachmentPath; 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

const issueSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setCurrentIssue: (state, action) => {
      state.currentIssue = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.issues.push(payload);
      })
      .addCase(createIssue.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.issues = []; 
      })
      .addCase(getIssues.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.issues = payload;
      })
      .addCase(getIssues.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getIssueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIssueById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentIssue = payload;
      })
      .addCase(getIssueById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssue.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentIssue = payload;
        const index = state.issues.findIndex((i) => i._id === payload._id);
        if (index !== -1) {
          state.issues[index] = payload;
        }
      })
      .addCase(updateIssue.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteIssue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssue.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.issues = state.issues.filter((i) => i._id !== payload);
        state.currentIssue = null;
      })
      .addCase(deleteIssue.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getAllIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIssues.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.issues = payload;
      })
      .addCase(getAllIssues.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(getSidebarIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSidebarIssues.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.sidebarIssues = payload;
      })
      .addCase(getSidebarIssues.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(searchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchIssues.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.issues = payload;
      })
      .addCase(searchIssues.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchSuggestions.pending, (state) => {
        
      })
      .addCase(fetchSuggestions.fulfilled, (state, { payload }) => {
        state.suggestions = payload;
      })
      .addCase(fetchSuggestions.rejected, (state, { payload }) => {
        
        state.error = payload;
      })
      .addCase(createComment.pending, (state) => {
        
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, { payload }) => {
        if (state.currentIssue) {
          state.currentIssue.comments.push(payload);
        }
        state.loading = false;
      })
      .addCase(createComment.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.currentIssue) {
          const index = state.currentIssue.comments.findIndex(
            (comment) => comment._id === payload._id
          );
          if (index !== -1) {
            state.currentIssue.comments[index] = payload; 
          }
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
        if (state.currentIssue) {
          state.currentIssue.comments = state.currentIssue.comments.filter(
            (comment) => comment._id !== payload.commentId
          );
        }
      })
      .addCase(deleteComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(uploadAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAttachment.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.currentIssue) {
          state.currentIssue.attachments.push(payload);
        }
      })
      .addCase(uploadAttachment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { setCurrentIssue, clearSuggestions } = issueSlice.actions;
export default issueSlice.reducer;