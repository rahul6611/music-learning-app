import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

export const assignContent = createAsyncThunk(
  'assignments/assignContent',
  async ({ teacherId, studentId, contentId, contentType, dueDate }, { rejectWithValue }) => {
    try {
      if (!teacherId || !studentId || !contentId) {
        throw new Error('Teacher ID, Student ID, and Content ID are required to create an assignment');
      }

      const assignmentData = {
        teacherId,
        studentId,
        contentId,
        contentType, // 'lesson' or 'technic'
        dueDate,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const assignmentRef = firestore().collection('assignments').doc();
      await assignmentRef.set(assignmentData);
      
      const newAssignment = {
        id: assignmentRef.id,
        ...assignmentData,
      };
      
      return newAssignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStudentAssignments = createAsyncThunk(
  'assignments/fetchStudentAssignments',
  async (studentId, { rejectWithValue }) => {
    try {
      if (!studentId) {
        throw new Error('Student ID is required to fetch assignments');
      }
      
      const query = firestore()
        .collection('assignments')
        .where('studentId', '==', studentId);
      
      const snapshot = await query.get();
      
      const assignments = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt ? {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds
        } : null;
        

        console.log("assignments>>", assignments);
        
        return {
          id: doc.id,
          ...data,
          createdAt: createdAt
        };
      });
      
      assignments.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.seconds : 0;
        const dateB = b.createdAt ? b.createdAt.seconds : 0;
        return dateB - dateA;
      });
    
      console.log("assignments>>", assignments);
      
      return assignments;
    } catch (error) {
      console.error('Error in fetchStudentAssignments:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateAssignmentStatus = createAsyncThunk(
  'assignments/updateStatus',
  async ({ assignmentId, status }, { rejectWithValue }) => {
    try {
      if (!assignmentId) {
        throw new Error('Assignment ID is required to update status');
      }

      const updateData = {
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('assignments').doc(assignmentId).update(updateData);
      
      return {
        id: assignmentId,
        status,
      };
    } catch (error) {
      console.error('Error updating assignment status:', error);
      return rejectWithValue(error.message);
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAssignments: (state) => {
      state.assignments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignContent.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.unshift(action.payload);
      })
      .addCase(assignContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchStudentAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAssignmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index].status = action.payload.status;
        }
      })
      .addCase(updateAssignmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer; 