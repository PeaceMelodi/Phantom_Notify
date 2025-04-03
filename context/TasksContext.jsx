import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, AppState, Vibration } from 'react-native';
import { useTheme } from './ThemeContext';

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

// TasksProvider component that wraps the app and provides tasks functionality
export const TasksProvider = ({ children }) => {
    // Get theme settings
    const { vibrationEnabled } = useTheme();
    
    // State to store all tasks
    const [tasks, setTasks] = useState([]);
    // Track app state for foreground/background
    const appState = useRef(AppState.currentState);

    // Register for push notifications permission and set up listeners
    useEffect(() => {
        // Request permissions
        registerForPushNotificationsAsync();

        // Set up notification listener
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            if (notification.request.content.data?.taskId) {
                // Trigger manual vibration for both iOS and Android when notification is received
                // This creates a stronger and longer vibration than what the system provides
                // Only trigger if vibration is enabled in settings
                if (vibrationEnabled) {
                    // For iOS, create an extremely intense vibration pattern
                    // iOS needs more aggressive patterns because it tends to dampen vibrations
                    if (Platform.OS === 'ios') {
                        // First intense burst - longer ON times, shorter OFF times for maximum intensity
                        const iOSIntensePattern = [0, 1000, 100, 1000, 100, 1000, 100, 1000];
                        Vibration.vibrate(iOSIntensePattern, false);
                        
                        // Chain multiple aggressive vibration sequences with minimal delay
                        setTimeout(() => {
                            Vibration.vibrate(iOSIntensePattern, false);
                        }, 2500);
                        
                        // Third sequence for extended duration
                        setTimeout(() => {
                            Vibration.vibrate(iOSIntensePattern, false);
                        }, 5000);
                        
                        // Final intense burst
                        setTimeout(() => {
                            Vibration.vibrate(iOSIntensePattern, false);
                        }, 7500);
                    } 
                    // For Android, keep existing pattern
                    else if (Platform.OS === 'android') {
                        // Immediate strong vibration
                        const strongVibrationPattern = [0, 1500, 300, 1500, 300, 1500, 300, 1500, 300, 1500, 300, 1500];
                        Vibration.vibrate(strongVibrationPattern, false);
                        
                        // Follow up with more vibrations for a truly intrusive experience
                        setTimeout(() => {
                            Vibration.vibrate(strongVibrationPattern, false);
                        }, 3000);
                        
                        setTimeout(() => {
                            Vibration.vibrate(strongVibrationPattern, false);
                        }, 6000);
                    }
                }
                
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
    }, [vibrationEnabled]);

    // Clean up tasks that have expired
    const cleanupExpiredTasks = () => {
        const now = new Date().getTime();
        setTasks(currentTasks => 
            currentTasks.filter(task => {
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
            })
        );
    };

    // Function to request notifications permissions
    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            // Create a notification channel with maximum importance and strong vibration
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                // Stronger vibration pattern for Android notifications
                // Extended length array with longer durations creates stronger vibrations
                vibrationPattern: vibrationEnabled ? [0, 2000, 300, 2000, 300, 2000, 300, 2000, 300, 2000] : [],
                lightColor: '#FF231F7C',
                enableVibrate: vibrationEnabled,  // Only enable vibration if setting is on
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
            console.log('Failed to get push token for push notification!');
            return;
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
                // For Android, add the maximum vibration pattern possible if enabled
                if (vibrationEnabled) {
                    notificationContent.vibrate = [0, 2000, 300, 2000, 300, 2000, 300, 2000, 300, 2000];
                }
                notificationContent.android = {
                    channelId: 'default',
                    priority: 'max',
                    vibrate: vibrationEnabled,
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
            
            setTasks(currentTasks => [...currentTasks, taskWithNotification]);
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
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
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
                // Cancel old notification
                await cancelTaskNotification(taskId);
                
                // Merge existing task with updates
                const mergedTask = { ...existingTask, ...updatedTask };
                
                // Schedule new notification
                const notificationId = await scheduleTaskNotification(mergedTask);
                
                // Calculate new scheduled time
                const now = new Date().getTime();
                const taskDate = new Date(mergedTask.date);
                const taskTime = new Date(mergedTask.time);
                
                taskDate.setHours(
                    taskTime.getHours(),
                    taskTime.getMinutes(),
                    taskTime.getSeconds(),
                    0
                );
                
                // Update task with new notification ID and scheduled time
        setTasks(currentTasks => 
            currentTasks.map(task => 
                        task.id === taskId ? { 
                            ...mergedTask, 
                            notificationId,
                            scheduledFor: taskDate.toISOString()
                        } : task
                    )
                );
                console.log('Task updated successfully');
            }
        } catch (error) {
            console.error('Error editing task:', error);
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


