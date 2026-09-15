(() => {
    'use strict';

    const STORAGE_KEY = 'taskforge_tasks';

    let tasks = [];

    // DOM
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    const pendingCount = document.getElementById('pending-count');
    const completedCount = document.getElementById('completed-count');
    const pendingEmpty = document.getElementById('pending-empty');
    const completedEmpty = document.getElementById('completed-empty');

    // --- Utilities ---
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    // --- Data ---
    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            // Storage full or unavailable
        }
    }

    function loadTasks() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    tasks = parsed;
                }
            }
        } catch (e) {
            tasks = [];
        }
    }

    // --- CRUD ---
    function addTask(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        tasks.push({
            id: generateId(),
            text: trimmed,
            completed: false,
            createdAt: Date.now(),
            completedAt: null
        });

        saveTasks();
        renderTasks();
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? Date.now() : null;

        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    function editTask(id, newText) {
        const trimmed = newText.trim();
        if (!trimmed) return false;

        const task = tasks.find(t => t.id === id);
        if (!task) return false;

        task.text = trimmed;
        saveTasks();
        renderTasks();
        return true;
    }

    // --- Rendering ---
    function updateCounts() {
        const pending = tasks.filter(t => !t.completed).length;
        const completed = tasks.filter(t => t.completed).length;

        pendingCount.textContent = `${pending} ${pending === 1 ? 'task' : 'tasks'}`;
        completedCount.textContent = `${completed} ${completed === 1 ? 'task' : 'tasks'}`;

        pendingEmpty.classList.toggle('hidden', pending > 0);
        completedEmpty.classList.toggle('hidden', completed > 0);
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.dataset.id = task.id;

        const content = document.createElement('div');
        content.className = 'task-content';

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;
        content.appendChild(textSpan);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';

        if (!task.completed) {
            // Complete button
            const completeBtn = document.createElement('button');
            completeBtn.className = 'task-btn complete-btn';
            completeBtn.setAttribute('aria-label', 'Mark complete');
            completeBtn.title = 'Mark complete';
            completeBtn.innerHTML = '&#10003;';
            completeBtn.addEventListener('click', () => toggleTask(task.id));
            actions.appendChild(completeBtn);

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'task-btn edit-btn';
            editBtn.setAttribute('aria-label', 'Edit task');
            editBtn.title = 'Edit';
            editBtn.innerHTML = '&#9998;';
            editBtn.addEventListener('click', () => startEdit(task.id, li));
            actions.appendChild(editBtn);
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn delete-btn';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.title = 'Delete';
        deleteBtn.innerHTML = '&#128465;';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        actions.appendChild(deleteBtn);

        content.appendChild(actions);
        li.appendChild(content);

        // Timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'task-timestamp';
        if (task.completed && task.completedAt) {
            timestamp.textContent = `Completed ${formatTime(task.completedAt)}`;
        } else {
            timestamp.textContent = `Added ${formatTime(task.createdAt)}`;
        }
        li.appendChild(timestamp);

        return li;
    }

    function renderTasks() {
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        const pendingTasks = tasks.filter(t => !t.completed);
        const completedTasks = tasks.filter(t => t.completed);

        pendingTasks.forEach(task => {
            pendingList.appendChild(createTaskElement(task));
        });

        completedTasks.forEach(task => {
            completedList.appendChild(createTaskElement(task));
        });

        updateCounts();
    }

    // --- Inline Edit ---
    function startEdit(id, li) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const textEl = li.querySelector('.task-text');
        const actionsEl = li.querySelector('.task-actions');

        // Hide actions
        actionsEl.style.display = 'none';

        // Create edit form
        const editForm = document.createElement('div');
        editForm.className = 'edit-form';

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = task.text;
        editInput.setAttribute('aria-label', 'Edit task text');

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-save';
        saveBtn.textContent = 'Save';
        saveBtn.type = 'button';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.type = 'button';

        editForm.appendChild(editInput);
        editForm.appendChild(saveBtn);
        editForm.appendChild(cancelBtn);

        // Replace text with edit form
        textEl.replaceWith(editForm);
        editInput.focus();
        editInput.select();

        function save() {
            const success = editTask(id, editInput.value);
            if (!success) {
                // Re-render will restore original state
                renderTasks();
            }
        }

        function cancel() {
            renderTasks();
        }

        saveBtn.addEventListener('click', save);
        cancelBtn.addEventListener('click', cancel);

        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                save();
            } else if (e.key === 'Escape') {
                cancel();
            }
        });
    }

    // --- Events ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
        taskInput.focus();
    });

    // --- Init ---
    loadTasks();
    renderTasks();
})();
