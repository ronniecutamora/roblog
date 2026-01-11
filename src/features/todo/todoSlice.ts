import { createSlice } from "@reduxjs/toolkit";
import { type PayloadAction } from "@reduxjs/toolkit";


interface Todo{
    id: number;
    name: string;
    completed: boolean;
}


interface TodoState{
    todos: Array<Todo>;
}

//define the initial state

const initialState:TodoState = {
    todos: [] 
}

//create actions and reducers
const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {

            const newTodo = {
                id: state.todos.length+1,
                name: action.payload,
                completed: false
            }

            state.todos.push(newTodo);
        },
        toggleTodo: (state, action: PayloadAction<number>) => {
            const todo = state.todos.find(t => t.id === action.payload);
            if (todo){
                todo.completed = true;
            }
        },
        deleteTodo: (state, action: PayloadAction<number>) => {
            state.todos = state.todos.filter(t=>t.id !== action.payload);
        },
        clearCompleted: (state) => {
            state.todos = state.todos.filter(t=>t.completed === false);
        }
    }
}) 

export const {addTodo, deleteTodo, clearCompleted, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;