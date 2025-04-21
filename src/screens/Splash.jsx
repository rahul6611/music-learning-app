import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';

export default function Splash({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

  const checkAuthAndNavigate = async () => {
    try {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            
            const userWithRole = {
              ...user._user,
              role: userData.role
            };
            
            dispatch(loginSuccess(userWithRole));
            
            const targetScreen = userData.role === 'teacher' ? 'TeacherProfile' : 'StudentProfile';
            
            navigation.replace('AppNavigator', { 
              screen: 'MainTabs',
              params: {
                screen: targetScreen
              }
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            setTimeout(() => {
              navigation.replace('Login');
            }, 2000);
          }
        } else {
          setTimeout(() => {
            navigation.replace('Login');
          }, 2500);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error in checkAuthAndNavigate:', error);
      setLoading(false);
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={styles.icon}>🎵</Text>
      <Text style={styles.text}>Music Learning App</Text>
      {loading && (
        <ActivityIndicator 
          size="large" 
          color="#fff" 
          style={styles.loader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 72,
    marginBottom: 20,
    color: '#fff',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: 10,
    fontSize: 16,
  },
});
