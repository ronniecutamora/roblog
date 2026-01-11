import { useSelector, useDispatch } from "react-redux";
import { type RootState } from '../../app/store';
import { addTodo, clearCompleted, deleteTodo, toggleTodo } from "./todoSlice";
import { useState } from "react";
import { toggleTheme } from "../theme/themeSlice";


export default function Todo(){

    const [input, setInput ] = useState("");
    const todos = useSelector((state: RootState) => state.todo.todos);
    const dispatch = useDispatch();

    const handleAdd = () => {
        dispatch(addTodo(input));
        setInput('');
    };

    return(
        <div className="container">
            <h1>Todo List</h1>
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type something"
            />
            <button onClick={handleAdd}>Add</button>
            <button onClick={() => dispatch(clearCompleted())}>Clear completed</button>
            <div className="todo-list">
                <ul>
                    {todos.map((todo) =>(
                        <li key={todo.id}>{todo.name} {todo.completed === true ? 'done': 'incomplete'}<button onClick={()=> dispatch(deleteTodo(todo.id))}>Delete</button><button onClick={() => dispatch(toggleTodo(todo.id))}>Toggle</button></li>
                     )
                    )}
                </ul>
            </div>
        </div>
    );

}