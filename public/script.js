const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const priorityInput = document.getElementById('priority-input'); // NEW
const todoList = document.getElementById('todo-list');

// Array to store tasks
let tasks = [];

// Load tasks from localStorage if available
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

// Add new task
todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    const priority = parseInt(priorityInput.value); // NEW
    if (text) {
        tasks.push({ text, started: false, priority });
        todoInput.value = '';
        priorityInput.value = '2'; // Reset to Medium
        renderTasks();
    }
});

function getPriorityColor(priority) {
    if (priority === 1) return '#ff7675'; // High - red
    if (priority === 2) return '#f6e58d'; // Medium - yellow
    return '#74b9ff'; // Low - blue
}

// Language integration
const translations = {
    en: {
        title: "To-Do List",
        placeholder: "Add a new task",
        add: "Add",
        empty: "No tasks available. Add a new task to get started!",
        finish: "Finish task",
        start: "Start",
        stop: "Stop",
        started: "Started",
        high: "🔥",
        medium: "⭐",
        low: "⬇️"
    },
    pl: {
        title: "Lista zadań",
        placeholder: "Dodaj nowe zadanie",
        add: "Dodaj",
        empty: "Brak zadań. Dodaj nowe zadanie, aby rozpocząć!",
        finish: "Zakończ zadanie",
        start: "Start",
        stop: "Stop",
        started: "W trakcie",
        high: "🔥",
        medium: "⭐",
        low: "⬇️"
    }
};

let currentLang = "en";

// Add language switch button logic
document.addEventListener("DOMContentLoaded", function() {
    const langBtn = document.getElementById("lang-btn");
    if (langBtn) {
        langBtn.addEventListener("click", function() {
            currentLang = currentLang === "en" ? "pl" : "en";
            setLang();
            renderTasks();
        });
    }
    setLang();
});

function setLang() {
    document.getElementById('main-title').textContent = translations[currentLang].title;
    document.getElementById('todo-input').placeholder = translations[currentLang].placeholder;
    document.getElementById('add-btn').textContent = translations[currentLang].add;
    document.getElementById('empty-list-message').textContent = translations[currentLang].empty;
    // Update select options
    const priorityInput = document.getElementById('priority-input');
    if (priorityInput) {
        priorityInput.options[0].text = translations[currentLang].high;
        priorityInput.options[1].text = translations[currentLang].medium;
        priorityInput.options[2].text = translations[currentLang].low;
    }
    // Update lang button text
    const langBtn = document.getElementById("lang-btn");
    if (langBtn) {
        langBtn.textContent = currentLang === "en" ? "Polski 🇵🇱" : "English 🇬🇧";
    }
}

// Render tasks
function renderTasks() {
    todoList.innerHTML = '';
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

    // Show or hide the empty list message
    const emptyMsg = document.getElementById('empty-list-message');
    if (sortedTasks.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
    }

    sortedTasks.forEach((task, index) => {
        const originalIndex = tasks.indexOf(task);
        let priorityLabel;
        if (task.priority === 1) priorityLabel = translations[currentLang].high;
        else if (task.priority === 2) priorityLabel = translations[currentLang].medium;
        else priorityLabel = translations[currentLang].low;
        const li = document.createElement('li');
        li.className = task.started ? 'started' : '';
        li.style.borderLeft = `8px solid ${getPriorityColor(task.priority)}`;
        li.innerHTML = `
            <span style="flex:1;display:flex;align-items:center;gap:8px;">
                <span style="font-size:1.3em;">${priorityLabel}</span>
                ${task.text}
            </span>
            <div style="display:flex;gap:6px;align-items:center;">
                <select title="Change priority" onchange="changePriority(${originalIndex}, this.value)" style="padding:4px 6px;border-radius:4px;border:1px solid #ccc;">
                    <option value="1" ${task.priority === 1 ? 'selected' : ''}>${translations[currentLang].high}</option>
                    <option value="2" ${task.priority === 2 ? 'selected' : ''}>${translations[currentLang].medium}</option>
                    <option value="3" ${task.priority === 3 ? 'selected' : ''}>${translations[currentLang].low}</option>
                </select>
                <button title="${task.started ? translations[currentLang].stop : translations[currentLang].start} task" onclick="startTask(${originalIndex})" style="background-color:#00b894;">
                    ${task.started ? '⏸️' : '▶️'}
                </button>
                <button title="${translations[currentLang].finish}" onclick="deleteTask(${originalIndex})" style="background-color:#d63031;">
                    ✅
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Change priority handler
window.changePriority = function(index, value) {
    if (!["1", "2", "3"].includes(value)) return;
    tasks[index].priority = parseInt(value);
    renderTasks();
};

// Delete task
window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
};

// Mark task as started
window.startTask = function(index) {
    tasks[index].started = !tasks[index].started;
    renderTasks();
};

// Initial render
renderTasks();