import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bandsService from '../../services/bandsService';

// Async thunks
export const fetchUserBands = createAsyncThunk(
  'bands/fetchUserBands',
  async (_, { rejectWithValue }) => {
    try {
      return await bandsService.getUserBands();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bands');
    }
  }
);

export const fetchBandDetails = createAsyncThunk(
  'bands/fetchBandDetails',
  async (bandId, { rejectWithValue }) => {
    try {
      return await bandsService.getBandDetails(bandId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch band details');
    }
  }
);

export const createBand = createAsyncThunk(
  'bands/createBand',
  async (bandData, { rejectWithValue }) => {
    try {
      return await bandsService.createBand(bandData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create band');
    }
  }
);

export const updateBand = createAsyncThunk(
  'bands/updateBand',
  async ({ bandId, bandData }, { rejectWithValue }) => {
    try {
      return await bandsService.updateBand(bandId, bandData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update band');
    }
  }
);

export const inviteMember = createAsyncThunk(
  'bands/inviteMember',
  async ({ bandId, email }, { rejectWithValue }) => {
    try {
      return await bandsService.inviteMember(bandId, email);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to invite member');
    }
  }
);

// Initial state
const initialState = {
  userBands: [],
  currentBand: null,
  loading: false,
  error: null,
};

// Slice
const bandsSlice = createSlice({
  name: 'bands',
  initialState,
  reducers: {
    clearBandError: (state) => {
      state.error = null;
    },
    clearCurrentBand: (state) => {
      state.currentBand = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bands
      .addCase(fetchUserBands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBands.fulfilled, (state, action) => {
        state.loading = false;
        state.userBands = action.payload;
      })
      .addCase(fetchUserBands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch band details
      .addCase(fetchBandDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBandDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBand = action.payload;
      })
      .addCase(fetchBandDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create band
      .addCase(createBand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBand.fulfilled, (state, action) => {
        state.loading = false;
        state.userBands.push(action.payload);
      })
      .addCase(createBand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update band
      .addCase(updateBand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBand.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBand = action.payload;
        const index = state.userBands.findIndex(band => band.id === action.payload.id);
        if (index !== -1) {
          state.userBands[index] = action.payload;
        }
      })
      .addCase(updateBand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Invite member
      .addCase(inviteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(inviteMember.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBandError, clearCurrentBand } = bandsSlice.actions;
export default bandsSlice.reducer;