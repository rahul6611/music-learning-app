import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import TeacherLibrary from '../screens/teacher/TeacherLibrary';
import TeacherHome from '../screens/teacher/TeacherHome';
import TeacherPerformance from '../screens/teacher/TeacherPerformance';
import TeacherTools from '../screens/teacher/TeacherTools';
import StudentHome from '../screens/student/StudentHome';

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  const { role } = useSelector((state) => state.auth);
  const isTeacher = role === 'teacher';


  console.log("role>>>", role);
  console.log("isTeacher>>>", isTeacher);
  

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#757575',
        headerStyle: styles.header,
        headerTintColor: '#fff',
      }}>
      <Tab.Screen
        name="Learning"
        component={isTeacher ? TeacherHome : StudentHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={TeacherLibrary}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Performance"
        component={TeacherPerformance}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="line-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={TeacherTools}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wrench" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  header: {
    backgroundColor: '#6200EE',
  },
});

export default AppTabNavigator; 