const inputTask = document.getElementById("inputTask");
const tasks = []; // весь массив задач

inputTask.addEventListener("keyup", (event) => {
    if (event.code === 'Enter') {
        tasks[tasks.length] = new Task(event.target.value, tasks.length);
        renderPage(document.querySelector('input[type="radio"]:checked').value);
        event.target.value = '';
    };
});

function Task(name, id) {
    this.name = name;
    this.id = id;
    this.description;
    this.status = {
        active: true,
        done: false,
        deleted: false,
    };
    this.changeStatus = (status) => {
        for (let key in this.status) {
            this.status[key] = false;
        }
        switch (status) {
            case "done":
                this.status.done = true;
                break;
            case "active":
                this.status.active = true;
                break;
            case "deleted":
                this.status.deleted = true;
                break;
            default:
                return "status must be 'active' 'done' or 'deleted'"
        };
        renderPage(document.querySelector('input[type="radio"]:checked').value);
    };
    this.changeDescription = (description) => {
        this.description = description;
    };
}

function renderTask(task) {
    if (task.status.active === true) {
        document.getElementById('tasksList').innerHTML += `<div class="taskCard"><h2>${task.name}</h2><input type="button" class="done" value="Выполнить" onclick="tasks[${task.id}].changeStatus('done')"><input type="button" class="deleted" value="Удалить" onclick="tasks[${task.id}].changeStatus('deleted')"></div>`;
    }
    if (task.status.done === true) {
        document.getElementById('tasksList').innerHTML += `<div class="taskCard"><h2>${task.name}</h2><input type="button" class="active" value="В работу" onclick="tasks[${task.id}].changeStatus('active')"><input type="button" class="deleted" value="Удалить" onclick="tasks[${task.id}].changeStatus('deleted')"></div>`;
    }
    if (task.status.deleted === true) {
        document.getElementById('tasksList').innerHTML += `<div class="taskCard"><h2>${task.name}</h2><input type="button" class="active" value="В работу" onclick="tasks[${task.id}].changeStatus('active')"></div>`;
    }
}

function getQuantityInTabs() {
    let active = 0, done = 0, deleted = 0;
    for (let key in tasks) {
        for (let statKey in tasks[key].status) {
            if (tasks[key].status[statKey]) {
                switch (statKey) {
                    case "active":
                        active++;
                        break;
                    case "done":
                        done++;
                        break;
                    case "deleted":
                        deleted++;
                        break;
                }
            }
        }
    }
    return {
        active: active,
        done: done,
        deleted: deleted,
    };
}

function renderQuantityInTabs() {
    let quantityInTabs = getQuantityInTabs();
    let activeTab = document.querySelector('#active + label>span');
    let doneTab = document.querySelector('#done + label>span');
    let deletedTab = document.querySelector('#deleted + label>span');

    quantityInTabs.active ? activeTab.textContent = " " + quantityInTabs.active : activeTab.textContent = '';
    quantityInTabs.done ? doneTab.textContent = " " + quantityInTabs.done : doneTab.textContent = '';
    quantityInTabs.deleted ? deletedTab.textContent = " " + quantityInTabs.deleted : deletedTab.textContent = '';
}

function renderTasksInStatus(status) {
    document.getElementById('tasksList').innerHTML = '';
    for (let key in tasks) {
        if (tasks[key].status[status] === true) {
            renderTask(tasks[key]);
        }
    }
}

function renderPage(status) {
    renderTasksInStatus(status);
    renderQuantityInTabs();
}