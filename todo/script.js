const STATUS_WORK = 'work'
const STATUS_DONE = 'done'
const STATUS_ARCHIVE = 'archive'

const TASK_STATUSES = [STATUS_WORK, STATUS_DONE, STATUS_ARCHIVE];
const TASKS = [];

let taskModel = {
    observers: [],
    addObserver: function (observer) {
        this.observers.push(observer);
    },
    notify: function () {
        this.observers.forEach(observer => { observer.update(this) });
    },
    addTask: function (name) {
        TASKS.push(new Task(name, TASKS.length));
        this.notify();
    },
    changeTaskStatus: function (id, status) {
        TASKS[id].changeStatus(status)
        this.notify();
    },
    getTasksInStatus: function (status) {
        return TASKS.filter((item) => {
            return (item.status === status)
        })
    },
}

let taskView = {
    model: taskModel,
    init: function () {
        WORK_TAB = document.querySelector('#work + label>span')
        DONE_TAB = document.querySelector('#done + label>span')
        ARCHIVE_TAB = document.querySelector('#archive + label>span')

        INPUT_TASK = document.getElementById('inputTask');
        TASKS_LIST = document.getElementById('tasksList');

        let inputs = document.querySelectorAll('input[type="radio"]');
        inputs.forEach(item => item.addEventListener("click", function () { taskController.changeTab(); }));

        INPUT_TASK.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                taskController.addTask(event.target.value);
                event.target.value = ''
            }
        });
    },
    renderQuantityInTabs: function () {
        let quantity = TASKS.reduce((result, task) => {
            result[task.status] = (result[task.status] || 0) + 1;
            return result;
        }, {});
        WORK_TAB.textContent = quantity[STATUS_WORK] || ''
        DONE_TAB.textContent = quantity[STATUS_DONE] || ''
        ARCHIVE_TAB.textContent = quantity[STATUS_ARCHIVE] || ''
    },
    renderTasksInStatus: function (model) {
        SELECTED_TAB = document.querySelector('input[type="radio"]:checked').value;
        TASKS_LIST.innerHTML = '';
        model.getTasksInStatus(SELECTED_TAB).forEach((item) => item.render());
    },
    renderView: function (model) {
        this.renderQuantityInTabs();
        this.renderTasksInStatus(model);
    },
    update: function (model) {
        this.renderView(model);
    },
}

function renderTasks(model) {
    SELECTED_TAB = document.querySelector('input[type="radio"]:checked').value;
    TASKS_LIST.innerHTML = '';
    model.getTasksInStatus(SELECTED_TAB).forEach((item) => item.render());
}

let taskController = {
    model: taskModel,
    addTask: function (name) {
        this.model.addTask(name);
    },
    changeTaskStatus: function (id, status) {
        this.model.changeTaskStatus(id, status);
    },
    changeTab: function () {
        this.model.notify();
    },
}

function Task(name, id) {
    this.name = name
    this.id = id
    this.description
    this.status = STATUS_WORK;
    this.changeStatus = (status) => {
        if (!status in TASK_STATUSES) {
            throw new Error(`status must be ${TASK_STATUSES.reduce((string, a) => string + a + ' ', 0)}`)
        }
        this.status = status
    }
    this.changeDescription = (description) => {
        this.description = description
    }
    this.render = () => {
        TASKS_LIST.innerHTML += getTaskTemplate(this);
    }
}

function getTaskTemplate(task) {
    const { id, status, name } = task;
    if (status === STATUS_WORK) {
        return `<div class="taskCard"><h2>${name}</h2><input type="button" class="done" value="✓" onclick="taskController.changeTaskStatus(${id},'${STATUS_DONE}')"><input type="button" class="deleted" value="×" onclick="taskController.changeTaskStatus(${id},'${TASK_STATUSES[2]}')"></div>`
    }
    if (status === STATUS_DONE) {
        return `<div class="taskCard"><h2>${name}</h2><input type="button" class="active" value="←" onclick="taskController.changeTaskStatus(${id},'${STATUS_WORK}')"></div>`
    }
    if (status === STATUS_ARCHIVE) {
        return `<div class="taskCard"><h2>${name}</h2><input type="button" class="active" value="←" onclick="taskController.changeTaskStatus(${id},'${STATUS_WORK}')"></div>`
    }
}

function init(view, model) {
    model.addObserver(view);
    view.init();
}

init(taskView, taskModel);