import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import MainPage from './component/MainPage';
import Welcome from './component/Welcome';
import Settings from './component/Settings';
import NewTask from './component/NewTask';
import * as Notifications from 'expo-notifications';
import { StatusBar, LogBox, Modal, View, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Custom fade transition that prevents white flashes
const fadeTransition = {
  cardStyleInterpolator: ({ current: { progress }, previous }) => {
    return {
      cardStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: 0,
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 200,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
      },
    },
  },
};

const AppContent = () => {
  // Modal state for battery optimization instructions
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const { colors, selectedFont } = useTheme();

  // Check if this is the first time opening the app
  const checkFirstTimeApp = async () => {
    if (Platform.OS !== 'android') return;

    try {
      // Check if we've already shown the modal to this user
      const hasShownModal = await AsyncStorage.getItem('@battery_modal_shown');
      
      if (!hasShownModal) {
        // Show the modal for first-time users only
        setShowBatteryModal(true);
        await AsyncStorage.setItem('@battery_modal_shown', 'true');
      }
    } catch (error) {
      console.log('Error checking first time app status:', error);
    }
  };

  // Set up notification handlers and check permissions when app starts
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Check notification permissions
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
        
        // Check if this is first time opening the app
        await checkFirstTimeApp();
        
        // Make sure any existing notifications are properly delivered
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response && response.notification.request.content.data.taskId) {
          // Handle any pending notification data if needed
        }

        // Listen for notifications while app is running
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          if (response && response.notification.request.content.data.taskId) {
            // Handle notification response if needed
          }
        });

        return () => subscription.remove();
      } catch (error) {
        console.log('Notification setup completed (local notifications only)');
      }
    };

    setupNotifications();
  }, []);

  // Mute specific Expo Go push notification error
  const originalConsoleError = console.error;
  console.error = function (...args) {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go')
    ) {
      return; // Suppress this specific error
    }
    originalConsoleError.apply(console, args);
  };

  // Suppress Expo Go push notification error
  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  ]);

  return (
    <>
      {/* Battery Optimization Modal */}
      <Modal
        visible={showBatteryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBatteryModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: colors.text, fontFamily: selectedFont }}>
              Improve Notification Reliability
            </Text>
            <Text style={{ fontSize: 15, marginBottom: 18, textAlign: 'center', color: colors.text, fontFamily: selectedFont }}>
              To ensure reminders work reliably, please disable battery optimization for this app in your phone's settings.{"\n\n"}Go to Settings &gt; Battery &gt; Battery Optimization &gt; Phantom Notify &gt; Don't optimize.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginBottom: 10 }}
              onPress={() => {
                setShowBatteryModal(false);
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              }}
            >
              <Text style={{ color: colors.card, fontWeight: 'bold', fontSize: 16, fontFamily: selectedFont }}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBatteryModal(false)}>
              <Text style={{ color: colors.accent, fontSize: 15, fontFamily: selectedFont }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Main App */}
      <TasksProvider>
        <StatusBar 
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <NavigationContainer 
          key="main-navigation"
          theme={{
            colors: {
              background: 'transparent',
              card: 'transparent',
              primary: 'transparent'
            }
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' },
              animationEnabled: true,
              detachPreviousScreen: false,
              ...fadeTransition
            }}
          >
            <Stack.Screen 
              name="Welcome" 
              component={Welcome} 
            />
            <Stack.Screen 
              name="MainPage" 
              component={MainPage} 
            />
            <Stack.Screen 
              name="Settings" 
              component={Settings} 
            />
            <Stack.Screen 
              name="NewTask" 
              component={NewTask} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </>
  );
};

const App = () => {
  // Set up notification handlers when app starts
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Make sure any existing notifications are properly delivered
        const response = await Notifications.getLastNotificationResponseAsync();
        if (response && response.notification.request.content.data.taskId) {
          // Handle any pending notification data if needed
        }

        // Listen for notifications while app is running
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          if (response && response.notification.request.content.data.taskId) {
            // Handle notification response if needed
          }
        });

        return () => subscription.remove();
      } catch (error) {
        console.log('Notification setup completed (local notifications only)');
      }
    };

    setupNotifications();
  }, []);

  // Mute specific Expo Go push notification error
  const originalConsoleError = console.error;
  console.error = function (...args) {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go')
    ) {
      return; // Suppress this specific error
    }
    originalConsoleError.apply(console, args);
  };

  // Suppress Expo Go push notification error
  LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  ]);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App

