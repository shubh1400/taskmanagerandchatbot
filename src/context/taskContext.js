import React, { Children, useContext, useState } from "react";


const TaskStateContext = React.createContext()
const TaskDispatchContext = React.createContext()

const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    return (
        <TaskStateContext.Provider value={tasks}>
            <TaskDispatchContext.Provider value={setTasks}>
                {children}
            </TaskDispatchContext.Provider>
        </TaskStateContext.Provider>
    )
}

const useTaskState = () => {
    return useContext(TaskStateContext)
}

const useTaskDispatch = () => {
    return useContext(TaskDispatchContext)
}

export { TaskProvider, useTaskState, useTaskDispatch }