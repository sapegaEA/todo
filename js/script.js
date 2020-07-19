'use strict';


class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();

    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }
    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),

            };
            this.todoData.set(newTodo.key, newTodo);

            this.render();

        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    handler() {
        const form = document.querySelector('.todo-control');
        const todoContainer = document.querySelector('.todo-container');
        const todo = document.querySelector('#todo');
        const completed = document.querySelector('#completed');

        const readLocalStorage = () => JSON.parse(localStorage.getItem('todo')) || [];

        const output = () => {
            const localData = readLocalStorage();

            todo.innerHTML = '';
            completed.innerHTML = '';

            localData.forEach((item, i) => {
                const newLi = document.createElement('li');
                newLi.classList.add('todo-item');
                newLi.setAttribute('data-id', i);
                newLi.innerHTML =
    '<span class="text-todo">' + item.title + '</span>' +
    '<div class="todo-buttons">' +
    '<button class="todo-remove"></button>' +
    '<button class="todo-complete"></button>' +
    '</div>';

                (item.status === false) ? todo.append(newLi) : completed.append(newLi);
            });
        };

        output();

        const insertToLocalStorage = data => {
            const localData = readLocalStorage();
            localData.push(data);
            localStorage.setItem('todo', JSON.stringify(localData));
            output();
        };

        const deleteItem = elem => {
            const localData = readLocalStorage();
            const parentId = +elem.closest('li').dataset.id;
            localData.splice(parentId, 1);
            localStorage.setItem('todo', JSON.stringify(localData));
            localStorage.setItem('toDoList', JSON.stringify(localData));
            output();
        };

        const completedItem = elem => {
            const localData = readLocalStorage();
            const parentId = +elem.closest('li').dataset.id;
            localData[parentId].status = true;
            localStorage.setItem('todo', JSON.stringify(localData));
            output();
        };

        form.addEventListener('submit', e => {
            e.preventDefault();

            const input = e.target.querySelector('input');
            if (input.value.length === 0 || !/[^\s]/.test(input.value)) {
                alert('Пустое дело добавить нельзя!');
                return input.value = null;
            }

            const data = {
                title: input.value,
                status: false
            };

            insertToLocalStorage(data);
            e.target.reset();
        });
        todoContainer.addEventListener('click', e => {
            const target = e.target;
            if (target.closest('.todo-remove')) {
                deleteItem(target);
            } else if (target.closest('.todo-complete')) {
                completedItem(target);
            }
        });
    }


    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();

    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
