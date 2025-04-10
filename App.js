import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import MainPage from './component/MainPage';
import Welcome from './component/Welcome';
import Settings from './component/Settings';
import NewTask from './component/NewTask';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'react-native';

// Configure default notification behavior at the app level
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Create a stack navigator instance for managing screen navigation
const Stack = createStackNavigator();

const App = () => {
  // Set up notification handlers when app starts
  useEffect(() => {
    // Make sure any existing notifications are properly delivered
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response && response.notification.request.content.data.taskId) {
        // Handle any pending notification data if needed
      }
    });

    // Listen for notifications while app is running
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response && response.notification.request.content.data.taskId) {
        // Handle notification response if needed
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    // ThemeProvider: Provides theme context to all child components
    // Allows app-wide theme management (colors, styles, etc.)
    <ThemeProvider>
      {/* TasksProvider: Provides tasks context to all child components
          Manages central task state and operations */}
      <TasksProvider>
        {/* StatusBar: Controls the appearance of the status bar */}
        <StatusBar 
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* NavigationContainer: Root component for navigation
            Manages navigation state and linking */}
        <NavigationContainer>
          {/* Stack.Navigator: Manages stack-based navigation
              Handles screen transitions and history */}
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' }
            }}
          >
            {/* Welcome Screen: Initial landing screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="Welcome" 
              component={Welcome} 
            />
            
            {/* MainPage Screen: Main task list screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="MainPage" 
              component={MainPage} 
            />
            
            {/* Settings Screen: App settings screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="Settings" 
              component={Settings} 
            />
            
            {/* NewTask Screen: Create/Edit task screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="NewTask" 
              component={NewTask} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </ThemeProvider>
  );
};

export default App

