import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, AppState } from 'react-native';
import { useTheme } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Create a context for tasks management
const TasksContext = createContext();

// Storage key for tasks
const TASKS_STORAGE_KEY = '@tasks_data';

// TasksProvider component that wraps the app and provides tasks functionality
export const TasksProvider = ({ children }) => {
    // Get theme settings
    const { colors } = useTheme();
    
    // State to store all tasks
    const [tasks, setTasks] = useState([]);
    // Track app state for foreground/background
    const appState = useRef(AppState.currentState);

    // Load saved tasks when the app starts
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
                if (savedTasks) {
                    const parsedTasks = JSON.parse(savedTasks);
                    // Clean up expired tasks before setting them
                    const now = new Date().getTime();
                    const activeTasks = parsedTasks.filter(task => {
                        const taskDate = new Date(task.date);
                        const taskTime = new Date(task.time);
                        
                        taskDate.setHours(
                            taskTime.getHours(),
                            taskTime.getMinutes(),
                            taskTime.getSeconds()
                        );
                        
                        const taskTime_ms = taskDate.getTime();
                        return taskTime_ms > now;
                    });
                    
                    setTasks(activeTasks);
                    // Save the cleaned up tasks back to storage
                    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(activeTasks));
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };
        loadTasks();
    }, []);

    // Save tasks whenever they change
    const saveTasks = async (updatedTasks) => {
        try {
            await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    // Register for push notifications permission and set up listeners
    useEffect(() => {
        // Request permissions
        registerForPushNotificationsAsync();

        // Set up notification listener
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            if (notification.request.content.data?.taskId) {
                deleteTask(notification.request.content.data.taskId);
            }
        });

        // Set up app state handler to refresh notifications when app comes to foreground
        const appStateSubscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) && 
                nextAppState === 'active'
            ) {
                cleanupExpiredTasks();
            }
            appState.current = nextAppState;
        });

        // Clean up expired tasks periodically
        const cleanupInterval = setInterval(cleanupExpiredTasks, 60000);

        // Clean up
        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            appStateSubscription.remove();
            clearInterval(cleanupInterval);
        };
    }, []);

    // Clean up tasks that have expired
    const cleanupExpiredTasks = () => {
        const now = new Date().getTime();
        setTasks(currentTasks => {
            const filteredTasks = currentTasks.filter(task => {
                // Calculate the task's scheduled time
                const taskDate = new Date(task.date);
                const taskTime = new Date(task.time);
                
                taskDate.setHours(
                    taskTime.getHours(),
                    taskTime.getMinutes(),
                    taskTime.getSeconds()
                );
                
                const taskTime_ms = taskDate.getTime();
                return taskTime_ms > now;
            });
            // Save the filtered tasks
            saveTasks(filteredTasks);
            return filteredTasks;
        });
    };

    // Function to request notifications permissions
    async function registerForPushNotificationsAsync() {
        try {
            if (Platform.OS === 'android') {
                // Create a notification channel with maximum importance
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    lightColor: '#FF231F7C',
                    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
                    sound: true
                });
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                console.log('Notification permissions not granted');
                return;
            }
            
            console.log('Notification permissions granted successfully');
        } catch (error) {
            console.log('Notification setup completed (local notifications only)');
        }
    }

    // Schedule a notification using millisecond-based relative timing
    const scheduleTaskNotification = async (task) => {
        try {
            // Calculate milliseconds until the task time
            const now = new Date().getTime();
            const taskDate = new Date(task.date);
            const taskTime = new Date(task.time);
            
            taskDate.setHours(
                taskTime.getHours(),
                taskTime.getMinutes(),
                taskTime.getSeconds(),
                0 // Reset milliseconds
            );
            
            const taskTime_ms = taskDate.getTime();
            const milliseconds = taskTime_ms - now;
            
            // Don't schedule if the time is in the past
            if (milliseconds <= 0) {
                console.log('Task time has already passed');
                return null;
            }
            
            console.log(`Scheduling notification for ${milliseconds} milliseconds from now`);
            
            // Cancel any existing notification first
            if (task.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(task.notificationId);
            }
            
            // Create a Date object for the trigger time
            const trigger = new Date(now + milliseconds);
            
            // Prepare notification message - use note if available, otherwise default message
            const notificationMessage = task.note && task.note.trim() !== '' 
                ? task.note 
                : 'Reminder for your scheduled task!';
            
            // Prepare notification content
            let notificationContent = {
                title: task.title,
                body: notificationMessage,
                sound: true,
                priority: 'max',
                data: { taskId: task.id },
            };
            
            // Add platform-specific settings
            if (Platform.OS === 'android') {
                notificationContent.android = {
                    channelId: 'default',
                    priority: 'max',
                    color: '#FF231F7C',
                    // Set HIGH importance
                    importance: Notifications.AndroidImportance.MAX,
                };
            } else if (Platform.OS === 'ios') {
                // iOS-specific settings
                notificationContent._displayInForeground = true;
            }
            
            // Schedule the notification with the calculated trigger time
            const id = await Notifications.scheduleNotificationAsync({
                content: notificationContent,
                trigger,
            });
            
            console.log(`Notification scheduled with ID: ${id}`);
            return id;
        } catch (error) {
            console.error('Error scheduling notification:', error);
            return null;
        }
    };

    // Cancel a notification
    const cancelTaskNotification = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (task && task.notificationId) {
                await Notifications.cancelScheduledNotificationAsync(task.notificationId);
                console.log(`Notification cancelled: ${task.notificationId}`);
            }
        } catch (error) {
            console.error('Error canceling notification:', error);
        }
    };

    // Add a new task
    const addTask = async (newTask) => {
        try {
            // Schedule notification and get ID
            const notificationId = await scheduleTaskNotification(newTask);
            
            // Add task with notification ID to state
            const taskWithNotification = {
                ...newTask,
                notificationId,
                scheduledFor: new Date(
                    // Calculate the exact scheduled time
                    new Date().getTime() + 
                    (new Date(newTask.date).setHours(
                        new Date(newTask.time).getHours(),
                        new Date(newTask.time).getMinutes(),
                        new Date(newTask.time).getSeconds(),
                        0
                    ) - new Date().getTime())
                ).toISOString()
            };
            
            setTasks(currentTasks => {
                const updatedTasks = [...currentTasks, taskWithNotification];
                saveTasks(updatedTasks);
                return updatedTasks;
            });
            console.log('Task added successfully');
            return taskWithNotification;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    };

    // Delete a task
    const deleteTask = async (taskId) => {
        try {
            // Cancel the notification
            await cancelTaskNotification(taskId);
            
            // Remove task from state
            setTasks(currentTasks => {
                const updatedTasks = currentTasks.filter(task => task.id !== taskId);
                saveTasks(updatedTasks);
                return updatedTasks;
            });
            console.log('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Edit a task
    const editTask = async (taskId, updatedTask) => {
        try {
            // Get existing task
            const existingTask = tasks.find(task => task.id === taskId);
            
            if (existingTask) {
                // Cancel existing notification
                await cancelTaskNotification(taskId);
                
                // Schedule new notification
                const notificationId = await scheduleTaskNotification(updatedTask);
                
                // Update task with new notification ID
                const taskWithNotification = {
                    ...updatedTask,
                    notificationId,
                    scheduledFor: new Date(
                        new Date().getTime() + 
                        (new Date(updatedTask.date).setHours(
                            new Date(updatedTask.time).getHours(),
                            new Date(updatedTask.time).getMinutes(),
                            new Date(updatedTask.time).getSeconds(),
                            0
                        ) - new Date().getTime())
                    ).toISOString()
                };
                
                setTasks(currentTasks => {
                    const updatedTasks = currentTasks.map(task => 
                        task.id === taskId ? taskWithNotification : task
                    );
                    saveTasks(updatedTasks);
                    return updatedTasks;
                });
                
                console.log('Task updated successfully');
                return taskWithNotification;
            }
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    };

    // Get milliseconds until a task is due
    const getMillisecondsUntilTask = (task) => {
        const taskDate = new Date(task.date);
        const taskTime = new Date(task.time);
        
        taskDate.setHours(
            taskTime.getHours(),
            taskTime.getMinutes(),
            taskTime.getSeconds(),
            0
        );
        
        return taskDate.getTime() - new Date().getTime();
    };

    // Format the time remaining for a task
    const formatTimeRemaining = (task) => {
        const ms = getMillisecondsUntilTask(task);
        
        if (ms <= 0) {
            return "Now";
        }
        
        // Convert to hours, minutes, seconds
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''}`;
        }
    };

    // Provide tasks state and management functions to children components
    return (
        <TasksContext.Provider value={{
            tasks,
            addTask,
            deleteTask,
            editTask,
            getMillisecondsUntilTask,
            formatTimeRemaining
        }}>
            {children}
        </TasksContext.Provider>
    );
};

// Custom hook to use tasks context
export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};


