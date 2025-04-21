import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppTabNavigator from './TabNavigator';
import StudentProfile from '../screens/student/StudentProfile';
import TeacherProfile from '../screens/teacher/TeacherProfile';
import CreateLesson from '../screens/teacher/CreateLesson';
import StudentList from '../screens/teacher/StudentList';
import StudentDetail from '../screens/teacher/StudentDetail';
import AllLessons from '../screens/teacher/AllLessons';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="MainTabs" 
        component={AppTabNavigator}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6200EE',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate(role === 'teacher' ? 'TeacherProfile' : 'StudentProfile')}>
              <Icon name="account-circle" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      {role === 'teacher' ? (
        <>
          <Stack.Screen 
            name="TeacherProfile" 
            component={TeacherProfile}
            options={{
              title: 'Profile',
              headerStyle: {
                backgroundColor: '#6200EE',
              },
              headerTintColor: 'black',
              headerRight: () => (
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={handleLogout}>
                  <Icon name="logout" size={24} color="black" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="CreateLesson" 
            component={CreateLesson}
            options={{
              title: 'Create Lesson',
              headerStyle: {
                backgroundColor: '#6200EE',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="AllLessons" 
            component={AllLessons}
            options={{
              title: 'My Lessons',
              headerStyle: {
                backgroundColor: '#6200EE',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="StudentList" 
            component={StudentList}
            options={{
              title: 'My Students',
              headerStyle: {
                backgroundColor: '#6200EE',
              },
              headerTintColor: '#fff',
            }}
          />
          <Stack.Screen 
            name="StudentDetail" 
            component={StudentDetail}
            options={{
              title: 'Student Profile',
              headerStyle: {
                backgroundColor: '#6200EE',
              },
              headerTintColor: '#fff',
              headerShown: false,
            }}
          />
        </>
      ) : (
        <Stack.Screen 
          name="StudentProfile" 
          component={StudentProfile}
          options={{
            title: 'Profile',
            headerStyle: {
              backgroundColor: '#6200EE',
            },
            headerTintColor: 'black',
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={handleLogout}>
                <Icon name="logout" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 