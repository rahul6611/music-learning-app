import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store';
import { theme } from './src/styles/theme';
import AppNavigator from './src/navigation/AppNavigator';
import Login from './src/screens/Auth/Login';
import Signup from './src/screens/Auth/Signup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Splash"
              screenOptions={{ 
                headerShown: false,
                animation: 'none' 
              }}
            >
              <Stack.Screen 
                name="Splash" 
                component={Splash}
                options={{
                  gestureEnabled: false
                }}
              />
              <Stack.Screen 
                name="Login" 
                component={Login}
                options={{
                  gestureEnabled: false
                }}
              />
              <Stack.Screen 
                name="Signup" 
                component={Signup}
                options={{
                  gestureEnabled: false
                }}
              />
              <Stack.Screen 
                name="AppNavigator" 
                component={AppNavigator}
                options={{
                  gestureEnabled: false
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
