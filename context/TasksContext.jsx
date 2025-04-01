import React, { createContext, useContext, useState } from 'react';

// Create a context for tasks management
const TasksContext = createContext();

// TasksProvider component that wraps the app and provides tasks functionality
export const TasksProvider = ({ children }) => {
    // State to store all tasks
    // Initialize as empty array that will hold task objects
    const [tasks, setTasks] = useState([]);

    // Add a new task to the tasks array
    // Takes a newTask object as parameter
    // Uses functional update to safely update state based on previous state
    const addTask = (newTask) => {
        setTasks(currentTasks => [...currentTasks, newTask]);
    };

    // Delete a task from the tasks array
    // Takes taskId as parameter
    // Filters out the task with matching id
    const deleteTask = (taskId) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    };

    // Edit an existing task
    // Takes taskId and updatedTask object as parameters
    // Maps through tasks, updating the matching task with new values
    const editTask = (taskId, updatedTask) => {
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.id === taskId ? { ...task, ...updatedTask } : task
            )
        );
    };

    // Provide tasks state and management functions to children components
    return (
        <TasksContext.Provider value={{ tasks, addTask, deleteTask, editTask }}>
            {children}
        </TasksContext.Provider>
    );
};

// Custom hook to use tasks context
// Provides easy access to tasks state and functions
// Throws error if used outside of TasksProvider
export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};


