import React from 'react';

function Todo({todo, toggleTodo}) {

    function handleTodoClick() {
        toggleTodo(todo.id)
    }

    return (
        <div>
            <label>
                <input type="checkbox" checked={todo.complete} onChange={handleTodoClick}></input>
                {todo.name}
                
            </label>
        </div>
    );
}

export default function TodoList({ todos, toggleTodo }) {
    /*
    return <Todo todo={todo} />: This line creates a React component called <Todo /> for the current todo item. 
    It passes the todo item as a prop to the Todo component (using todo={todo}). 
    This allows the Todo component to access and display the to-do item's information.
    */
   //Wrapping the map function in {} allows it to be within a div
   //key={todo}  This makes it so only changes items are re-rendered when a change happens.
    return (
        <div>
            These are my to-dos:
            {todos.map(todo => {
                return <Todo key={todo.id} toggleTodo={toggleTodo} todo={todo}/>
            })}

        </div>
    );
}