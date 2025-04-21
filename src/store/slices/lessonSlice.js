import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  lessons: [],
  loading: false,
  error: null,
};

export const createLesson = createAsyncThunk(
  'lessons/create',
  async ({ title, description, imageUrl, videoUrl, userId, userEmail }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required to create a lesson');
      }

      const lessonData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        videoUrl,
        userId,
        userEmail,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const lessonRef = firestore().collection('Lesson').doc();
      await lessonRef.set(lessonData);
      
      const newLesson = {
        id: lessonRef.id,
        ...lessonData,
      };
      
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLessons = createAsyncThunk(
  'lessons/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch lessons');
      }
      
      const query = firestore()
        .collection('Lesson')
        .where('userId', '==', userId);
      
      const snapshot = await query.get();
      
      const lessons = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt ? {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds
        } : null;
        
        return {
          id: doc.id,
          ...data,
          createdAt: createdAt
        };
      });
      
      lessons.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.seconds : 0;
        const dateB = b.createdAt ? b.createdAt.seconds : 0;
        return dateB - dateA;
      });
    
      return lessons;
    } catch (error) {
      console.error('Error in fetchLessons:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  'lessons/update',
  async ({ id, title, description, imageUrl, videoUrl, userId, userEmail }, { rejectWithValue }) => {
    try {
      if (!id || !userId) {
        throw new Error('Lesson ID and User ID are required to update a lesson');
      }

      const lessonData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        videoUrl,
        userId,
        userEmail,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('Lesson').doc(id).update(lessonData);
      
      return {
        id,
        ...lessonData,
      };
    } catch (error) {
      console.error('Error updating lesson:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'lessons/delete',
  async (lessonId, { rejectWithValue }) => {
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required to delete a lesson');
      }
      
      await firestore().collection('Lesson').doc(lessonId).delete();
      return lessonId;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return rejectWithValue(error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons.unshift(action.payload);
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
        console.log("Updated lessons in Redux store:", state.lessons);
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = lessonSlice.actions;
export default lessonSlice.reducer; 