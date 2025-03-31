import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
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
        <TaskContext.Provider value={{ tasks, addTask, deleteTask, editTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};