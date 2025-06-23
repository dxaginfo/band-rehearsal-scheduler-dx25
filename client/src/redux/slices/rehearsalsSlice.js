import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rehearsalsService from '../../services/rehearsalsService';

// Async thunks
export const fetchBandRehearsals = createAsyncThunk(
  'rehearsals/fetchBandRehearsals',
  async (bandId, { rejectWithValue }) => {
    try {
      return await rehearsalsService.getBandRehearsals(bandId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsals');
    }
  }
);

export const fetchRehearsalDetails = createAsyncThunk(
  'rehearsals/fetchRehearsalDetails',
  async (rehearsalId, { rejectWithValue }) => {
    try {
      return await rehearsalsService.getRehearsalDetails(rehearsalId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsal details');
    }
  }
);

export const createRehearsal = createAsyncThunk(
  'rehearsals/createRehearsal',
  async ({ bandId, rehearsalData }, { rejectWithValue }) => {
    try {
      return await rehearsalsService.createRehearsal(bandId, rehearsalData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rehearsal');
    }
  }
);

export const updateRehearsal = createAsyncThunk(
  'rehearsals/updateRehearsal',
  async ({ rehearsalId, rehearsalData }, { rejectWithValue }) => {
    try {
      return await rehearsalsService.updateRehearsal(rehearsalId, rehearsalData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rehearsal');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'rehearsals/updateAttendance',
  async ({ rehearsalId, status }, { rejectWithValue }) => {
    try {
      return await rehearsalsService.updateAttendance(rehearsalId, status);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update attendance');
    }
  }
);

// Initial state
const initialState = {
  rehearsals: [],
  currentRehearsal: null,
  loading: false,
  error: null,
};

// Slice
const rehearsalsSlice = createSlice({
  name: 'rehearsals',
  initialState,
  reducers: {
    clearRehearsalError: (state) => {
      state.error = null;
    },
    clearCurrentRehearsal: (state) => {
      state.currentRehearsal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch band rehearsals
      .addCase(fetchBandRehearsals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBandRehearsals.fulfilled, (state, action) => {
        state.loading = false;
        state.rehearsals = action.payload;
      })
      .addCase(fetchBandRehearsals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch rehearsal details
      .addCase(fetchRehearsalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRehearsalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRehearsal = action.payload;
      })
      .addCase(fetchRehearsalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create rehearsal
      .addCase(createRehearsal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRehearsal.fulfilled, (state, action) => {
        state.loading = false;
        state.rehearsals.push(action.payload);
      })
      .addCase(createRehearsal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update rehearsal
      .addCase(updateRehearsal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRehearsal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRehearsal = action.payload;
        const index = state.rehearsals.findIndex(rehearsal => rehearsal.id === action.payload.id);
        if (index !== -1) {
          state.rehearsals[index] = action.payload;
        }
      })
      .addCase(updateRehearsal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentRehearsal && state.currentRehearsal.id === action.payload.rehearsalId) {
          state.currentRehearsal.attendance = action.payload.attendance;
        }
        // Update the rehearsal in the list
        const index = state.rehearsals.findIndex(rehearsal => rehearsal.id === action.payload.rehearsalId);
        if (index !== -1) {
          state.rehearsals[index].attendance = action.payload.attendance;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRehearsalError, clearCurrentRehearsal } = rehearsalsSlice.actions;
export default rehearsalsSlice.reducer;