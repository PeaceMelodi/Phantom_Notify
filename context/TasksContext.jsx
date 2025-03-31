import React, { createContext, useContext, useState } from 'react';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const addTask = (newTask) => {
        setTasks(currentTasks => [...currentTasks, newTask]);
    };

    const deleteTask = (taskId) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    };

    const editTask = (taskId, updatedTask) => {
        setTasks(currentTasks => 
            currentTasks.map(task => 
                task.id === taskId ? { ...task, ...updatedTask } : task
            )
        );
    };

    return (
        <TasksContext.Provider value={{ tasks, addTask, deleteTask, editTask }}>
            {children}
        </TasksContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};

