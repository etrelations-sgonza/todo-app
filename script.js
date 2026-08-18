// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = 'all';
        this.storageKey = 'todoList';

        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        this.clearBtn = document.getElementById('clearBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // Initialize
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.attachEventListeners();
        this.render();
    }

    attachEventListeners() {
        // Add todo on button click
        this.addBtn.addEventListener('click', () => this.addTodo());

        // Add todo on Enter key
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter buttons
        this.filterBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Clear completed button
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTodo() {
        const text = this.todoInput.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.todoInput.focus();

        this.saveToStorage();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.saveToStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    setFilter(filter) {
        this.filter = filter;

        // Update active button
        this.filterBtns.forEach((btn) => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    clearCompleted() {
        if (this.todos.some((todo) => todo.completed)) {
            if (confirm('Are you sure you want to delete all completed tasks?')) {
                this.todos = this.todos.filter((todo) => !todo.completed);
                this.saveToStorage();
                this.render();
            }
        }
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter((todo) => !todo.completed);
            case 'completed':
                return this.todos.filter((todo) => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();

        // Clear the list
        this.todoList.innerHTML = '';

        // Render todos or empty state
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <p>${this.getEmptyMessage()}</p>
                </div>
            `;
        } else {
            filteredTodos.forEach((todo) => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                    >
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn">Delete</button>
                `;

                // Checkbox event
                li.querySelector('.checkbox').addEventListener('change', () => {
                    this.toggleTodo(todo.id);
                });

                // Delete button event
                li.querySelector('.delete-btn').addEventListener('click', () => {
                    this.deleteTodo(todo.id);
                });

                this.todoList.appendChild(li);
            });
        }

        // Update stats
        this.updateStats();
    }

    updateStats() {
        const activeTodos = this.todos.filter((todo) => !todo.completed).length;
        const completedTodos = this.todos.filter((todo) => todo.completed).length;

        let countText = '';
        if (this.filter === 'all') {
            countText = `${this.todos.length} task${this.todos.length !== 1 ? 's' : ''}`;
        } else if (this.filter === 'active') {
            countText = `${activeTodos} active task${activeTodos !== 1 ? 's' : ''}`;
        } else {
            countText = `${completedTodos} completed task${completedTodos !== 1 ? 's' : ''}`;
        }

        this.todoCount.textContent = countText;

        // Disable clear button if no completed todos
        this.clearBtn.disabled = completedTodos === 0;
    }

    getEmptyMessage() {
        switch (this.filter) {
            case 'active':
                return 'No active tasks! Great job! 🎉';
            case 'completed':
                return 'No completed tasks yet.';
            default:
                return 'No tasks yet. Add one to get started! ✨';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.todos = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading todos from storage:', e);
                this.todos = [];
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
