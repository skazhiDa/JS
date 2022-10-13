// eslint-disable-next-line func-names
(function () {
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', '');

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', () => {
      if (!input.value) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создание элемента списка
  function createTodoItem(name, localStorageName, localArr) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    doneButton.addEventListener('click', () => {
      item.classList.toggle('list-group-item-success');

      // изменим состояние(done: true или false, в зависимости от прежнего состояния)
      // в локальном массиве и localStorage
      if (localArr) {
        for (let i of localArr) {
          if (i.name === name) {
            if (item.classList.contains('list-group-item-success')) {
              i.done = true;
              break;
            } else {
              i.done = false;
              break;
            }
          }
        }
        localStorage.setItem(localStorageName, JSON.stringify(localArr));
      }
    });

    deleteButton.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Вы уверены?')) {
        // удалим из локального массива и localStorage
        if (localArr) {
          for (let i in localArr) {
            if (localArr[i].name === name) {
              localArr.splice(i, 1);
            }
          }
          localStorage.setItem(localStorageName, JSON.stringify(localArr));
        }
        item.remove();
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // Создаём приложение. Передаем container(оболочка, простой div), title(название списка),
  // localStorageName(имя объекта, по умолчанию - default), массив объектов(элементы списка)
  function createTodoApp(container, title = 'Список дел', localstorageName = 'default', todoArr = null) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // создаем локальный массив, который принимает значения localStorage или является
    // пустым. localArr не может быть null, иначе получим исключение localArr in not iterable
    let localArr = JSON.parse(localStorage.getItem(localstorageName)) == null ? []
      : JSON.parse(localStorage.getItem(localstorageName));

    // из переданного массива помещаем в локальный, при этом проверяем на повторение (чтобы при
    // каждом обновлении страницы не прибавлялись уже добавленные объекты
    // todoArr не может быть null, иначе получим исключение localArr in not iterable
    if (todoArr) {
      for (let i of todoArr) {
        let flag = true;
        for (let j of localArr) {
          if (j.name === i.name) flag = false;
        }
        if (flag) localArr.push(i);
      }
    }

    // из локально массива в localStorage
    if (localArr) {
      for (let i of localArr) {
        let todoLocalArr = createTodoItem(i.name, localstorageName, localArr);
        if (i.done === true) todoLocalArr.item.classList.toggle('list-group-item-success');
        todoList.append(todoLocalArr.item);
      }
    }
    localStorage.setItem(localstorageName, JSON.stringify(localArr));

    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      // при добавлении элемента списка нажатием кнопки ДОБАВИТЬ ДЕЛО, сначала добавим его в
      // локальный массив и localStorage.
      let newObj = {
        name: todoItemForm.input.value,
        done: false,
      };
      localArr.push(newObj);
      localStorage.setItem(localstorageName, JSON.stringify(localArr));

      let todoItem = createTodoItem(todoItemForm.input.value, localstorageName, localArr);

      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
    });
  }

  window.createTodoApp = createTodoApp;
}());
