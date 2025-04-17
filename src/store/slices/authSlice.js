import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  role: null, 
};

GoogleSignin.configure({
  webClientId: '711093058308-1pe74d01hj3jib8bks8ldsbamjj40uum.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, role, name }, { dispatch }) => {
    try {   
      dispatch(signupStart());
      const user = await auth().createUserWithEmailAndPassword(email, password);
      console.log('signup>>> user', user);
      
      if (name) {
        await user.user.updateProfile({
          displayName: name
        });
      }
      
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
          
          dispatch(signupSuccess(userWithRole));
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

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch }) => {
    try {
      dispatch(loginStart());
      const user = await auth().signInWithEmailAndPassword(email, password) 
      console.log('login>>> user', user);
      
      const userDoc = await firestore().collection('users').doc(user.user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};
      
      const userWithRole = {
        ...user.user._user,
        role: userData.role
      };
      
      dispatch(loginSuccess(userWithRole));
      return user;
    } catch (error) {
      console.log('login error', error);
      if (error.code === 'auth/email-already-in-use') {
        dispatch(loginFailure('That email address is already in use!'));
      }
      if (error.code === 'auth/invalid-email') {
        dispatch(loginFailure('That email address is invalid!'));
      }
      
      throw error;
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, { dispatch }) => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      console.log('signInResult', signInResult);
      
      let idToken = signInResult.data?.idToken;
      if (!idToken) {
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }
    
      const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);
      
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log('Google login>>> user', userCredential);
      
      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
      
      if (!userDoc.exists) {
        await firestore().collection('users').doc(userCredential.user.uid).set({
          email: userCredential.user.email,
          fullName: userCredential.user.displayName || '',
          role: 'user', // Default role
          createdAt: firestore.FieldValue.serverTimestamp(),
          googleSignIn: true
        });
      }
      
      // Get user data with role
      const userData = userDoc.exists ? userDoc.data() : { role: 'user' };
      
      // Create a user object with role information
      const userWithRole = {
        ...userCredential.user._user,
        role: userData.role || 'user'
      };
      
      dispatch(loginSuccess(userWithRole));
      
      return userCredential;
    } catch (error) {
      console.error('Google login error:', error);
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      auth().signOut()
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.role = action.payload.role || 'user';
      state.error = null;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.role = action.payload.role || 'user';
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.role = null;
    },
  },
});

export const { 
  signupStart, 
  signupSuccess, 
  signupFailure,
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout 
} = authSlice.actions;

export default authSlice.reducer; 