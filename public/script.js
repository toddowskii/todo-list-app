const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

let todos = [];

// Function to render the todo list
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeTodo(index);
        li.appendChild(removeButton);
        todoList.appendChild(li);
    });
}

// Function to add a new todo
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        todos.push(todoText);
        todoInput.value = '';
        renderTodos();
    }
}

// Function to remove a todo
function removeTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

// Event listener for the add button
addButton.addEventListener('click', addTodo);

// Optional: Allow pressing Enter to add a todo
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// Initial render
renderTodos();