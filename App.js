import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import MainPage from './component/MainPage';
import Welcome from './component/Welcome';
import Settings from './component/Settings';
import NewTask from './component/NewTask';

// Create a stack navigator instance for managing screen navigation
const Stack = createStackNavigator();

const App = () => {
  return (
    // ThemeProvider: Provides theme context to all child components
    // Allows app-wide theme management (colors, styles, etc.)
    <ThemeProvider>
      {/* TasksProvider: Provides tasks context to all child components
          Manages central task state and operations */}
      <TasksProvider>
        {/* NavigationContainer: Root component for navigation
            Manages navigation state and linking */}
        <NavigationContainer>
          {/* Stack.Navigator: Manages stack-based navigation
              Handles screen transitions and history */}
          <Stack.Navigator>
            {/* Welcome Screen: Initial landing screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="Welcome" 
              component={Welcome} 
              options={{headerShown: false}}
            />
            
            {/* MainPage Screen: Main task list screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="MainPage" 
              component={MainPage} 
              options={{headerShown: false}}
            />
            
            {/* Settings Screen: App settings screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="Settings" 
              component={Settings} 
              options={{headerShown: false}}
            />
            
            {/* NewTask Screen: Create/Edit task screen
                headerShown: false - hides default navigation header */}
            <Stack.Screen 
              name="NewTask" 
              component={NewTask} 
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </ThemeProvider>
  );
};

export default App

