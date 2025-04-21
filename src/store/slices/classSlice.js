import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  class: [],
  loading: false,
  error: null,
};

export const createClass = createAsyncThunk(
  'class/create',
  async ({ }, { rejectWithValue }) => {
    try {
      const classData = {
      };

      const classRef = firestore().collection('Lesson').doc();
      await classRef.set(classData);
      
      const newLesson = {
        id: classRef.id,
        ...classData,
      };
      
      return newLesson;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchClass = createAsyncThunk(
  'class/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firestore().collection('Lesson').get();
      const allClass = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return allClass;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  'class/delete',
  async (classId, { rejectWithValue }) => {
    try {
      await firestore().collection('Lesson').doc(classId).delete();
      return classId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.class.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClass.fulfilled, (state, action) => {
        state.loading = false;
        state.class = action.payload;
      })
      .addCase(fetchClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.class = state.class.filter(el => el.id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = classSlice.actions;
export default classSlice.reducer; 