// ==========================================
// 1. SELECT HTML ELEMENTS / تحديد عناصر الـ HTML
// ==========================================
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const filterBtns = document.querySelectorAll('.filter-btn');

// ==========================================
// 2. STATE MANAGEMENT / إدارة البيانات والحالة
// ==========================================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ==========================================
// 3. RENDER FUNCTION / دالة عرض المهام في الواجهة
// ==========================================
function renderTasks() {
    todoList.innerHTML = '';

    const filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(function(task) {
        const li = document.createElement('li');
        
        // استخدام الاقتباس العادي بدون backticks
        if (task.completed) {
            li.className = "todo-item completed";
        } else {
            li.className = "todo-item";
        }

        // دمج النصوص باستخدام (+) بدلاً من الـ Backticks
        li.innerHTML = '<span class="todo-text" onclick="toggleTask(' + task.id + ')">' + task.title + '</span>' +
                       '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">✕</button>';

        todoList.appendChild(li);
    });

    const activeTasksCount = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCount.textContent = "Tasks remaining: " + activeTasksCount;

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ==========================================
// 4. EVENT HANDLERS & LOGIC / الأحداث والمنطق
// ==========================================

todoForm.addEventListener('submit', function(e) {
    e.preventDefault(); // يمنع إختفاء العناصر وإعادة تحميل الصفحة

    const taskTitle = todoInput.value.trim();
    if (taskTitle === '') return;

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false
    };

    tasks.push(newTask);
    todoInput.value = '';
    renderTasks();
});

function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            return {
                id: task.id,
                title: task.title,
                completed: !task.completed
            };
        }
        return task;
    });
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    renderTasks();
}

filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) {
            b.classList.remove('active');
        });
        
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// تشغيل دالة العرض عند البداية
renderTasks();