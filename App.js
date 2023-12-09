import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScannerScreen from './ScannerScreen';
import LearnScreen from './LearnScreen';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AppContext from './AppContext';
import * as SplashScreen from 'expo-splash-screen';
import AssistantScreen from './AssistantScreen';
import LogScreen from './LogScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);  // For splash screen

  useEffect(() => {
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible

        // Perform any additional tasks you need to prepare your app
        // like loading resources, data fetching, etc.

        // Wait for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync(); // Hide the splash screen
      }
    }

    prepareApp();
  }, []);

  
  if (!appIsReady) {
    return null;
  }

  if (errorMessage) {
    console.error(errorMessage);
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Define the icon based on the route name
            if (route.name === 'Scanner') {
              iconName = focused ? 'ios-scan' : 'ios-scan-outline';
            } else if (route.name === 'Learn') {
              iconName = focused ? 'ios-book' : 'ios-book-outline';
            } else if (route.name === 'Meal Mentor') {
              iconName = focused ? 'ios-person' : 'ios-person-outline';
            } else if (route.name === 'Log') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // Return the icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',  // Color of the active icon
          tabBarInactiveTintColor: 'gray', // Color of the inactive icon
          tabBarStyle: [
            {
              display: 'flex'
            },
            null
          ],
          lazy: false
        })}
      >
        <Tab.Screen name="Scanner" component={ScannerScreen} />
        <Tab.Screen name="Learn" component={LearnScreen} />
        <Tab.Screen name="Meal Mentor" component={AssistantScreen} />
        <Tab.Screen name="Log" component={LogScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
