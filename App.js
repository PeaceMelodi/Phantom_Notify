import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './context/ThemeContext';
import MainPage from './component/MainPage';
import Welcome from './component/Welcome';
import Settings from './component/Settings';
import NewTask from './component/NewTask';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}}/>
          <Stack.Screen name="MainPage" component={MainPage} options={{headerShown: false}}/>
          <Stack.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
          <Stack.Screen name="NewTask" component={NewTask} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}

export default App
