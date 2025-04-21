import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const initialState = {
  myStudents: [],
  loading: false,
  error: null,
};


export const addStudentByTeacher = createAsyncThunk(
  'auth/addStudentByTeacher',
  async ({ email, password, role, name }, { dispatch }) => {
    try {   

      const user = await auth().createUserWithEmailAndPassword(email, password);
      console.log('signup>>> user', user);

      if (user.user.uid) {
        const userDataToStore = {
          email: email,
          role: role,
          fullName: name || '',
          createdAt: firestore.FieldValue.serverTimestamp()
        };
        
        try {
          const userRef = firestore().collection('users').doc(user.user.uid);
          await userRef.set(userDataToStore, { merge: true });
          
          const verifyDoc = await userRef.get();
          if (verifyDoc.exists) {
            console.log('Successfully verified data in Firestore:', verifyDoc.data());
          } else {
            console.error('Write appeared to succeed but document does not exist');
          }

          const userWithRole = {
            ...user.user._user,
            role: role
          };
          
        } catch (firestoreError) {
          console.error('Detailed Firestore error:', {
            code: firestoreError.code,
            message: firestoreError.message,
            details: firestoreError.details,
          });
          throw new Error(`Failed to store user data: ${firestoreError.message}`);
        }
      }
      
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      dispatch(signupFailure(error.message));
      throw error;
    }
  }
);


const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      if (!state.myStudents.includes(action.payload)) {
        state.myStudents.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.myStudents = state.myStudents.filter(id => id !== action.payload);
    },
    clearStudents: (state) => {
      state.myStudents = [];
    },
  },
});

export const { addStudent, removeStudent, clearStudents } = teacherSlice.actions;
export default teacherSlice.reducer; 