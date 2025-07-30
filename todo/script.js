const INPUT_TASK = document.getElementById('inputTask')
const TASKS = [] // весь массив задач

const TASK_STATUSES = ['active', 'done', 'deleted']
const ACTIVE_TAB = document.querySelector('#active + label>span')
const DONE_TAB = document.querySelector('#done + label>span')
const DELETED_TAB = document.querySelector('#deleted + label>span')
const TASKS_LIST = document.getElementById('tasksList')

INPUT_TASK.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
        TASKS.push(new Task(event.target.value, TASKS.length))
        renderPage(document.querySelector('input[type="radio"]:checked').value)
        event.target.value = ''
    }
})

function Task(name, id) {
    this.name = name
    this.id = id
    this.description
    this.status = 'active'
    this.changeStatus = (status) => {
        if (!status in TASK_STATUSES) {
            throw new Error("status must be 'active' 'done' or 'deleted'")
        }
        this.status = status
        renderPage(document.querySelector('input[type="radio"]:checked').value)
    }
    this.changeDescription = (description) => {
        this.description = description
    }
    this.render = () => {
        const { status, name, id } = this

        if (status === 'active') {
            TASKS_LIST.innerHTML += `<div class="taskCard"><h2>${name}</h2><input type="button" class="done" value="Выполнить" onclick="TASKS[${id}].changeStatus('done')"><input type="button" class="deleted" value="Удалить" onclick="TASKS[${id}].changeStatus('deleted')"></div>`
        }
        if (status === 'done') {
            TASKS_LIST.innerHTML += `<div class="taskCard"><h2>${name}</h2><input type="button" class="active" value="В работу" onclick="TASKS[${id}].changeStatus('active')"><input type="button" class="deleted" value="Удалить" onclick="TASKS[${id}].changeStatus('deleted')"></div>`
        }
        if (status === 'deleted') {
            TASKS_LIST.innerHTML += `<div class="taskCard"><h2>${name}</h2><input type="button" class="active" value="В работу" onclick="TASKS[${id}].changeStatus('active')"></div>`
        }
    }
}

const getQuantityInTabs = () =>
    TASKS.reduce(
        (result, { status }) => ({
            ...result,
            [status]: (result[status] ?? 0) + 1,
        }),
        {}
    )

function renderQuantityInTabs() {
    const { active, done, deleted } = getQuantityInTabs()

    ACTIVE_TAB.textContent = active || ''
    DONE_TAB.textContent = done || ''
    DELETED_TAB.textContent = deleted || ''
}

function renderTasksInStatus(status) {
    TASKS_LIST.innerHTML = ''

    TASKS.forEach((task) => task.status === status && task.render())
}

function renderPage(status) {
    renderTasksInStatus(status)
    renderQuantityInTabs()
}
