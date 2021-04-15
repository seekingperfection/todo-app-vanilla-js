const state =  {
    list: JSON.parse(localStorage.getItem('todos')) || []
}
//isideti i local storage

const todos = document.getElementById('todos');
const valueFromInput = document.getElementById('enter-item-title');

// Lets add new item after we click 'Enter'
valueFromInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addNewTodoItem(getValueFromInput());
    }
});

function errorMessage(value) {
    const errorBox = document.getElementById('error-box')
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('text-red', 'error-message');
    errorMessage.id = 'error-msg';
    errorMessage.textContent = value;
    errorBox.appendChild(errorMessage);
}

function defaultMessage(value) {
    const defaultBox = document.getElementById('default-box');
    const defaultMessage = document.createElement('div');
    defaultMessage.id = 'default-msg';
    defaultMessage.classList.add('default-message', 'mb-10');
    defaultMessage.textContent = value;
    if (defaultBox.children.length < 2) {
        defaultBox.appendChild(defaultMessage);
    }
}

function getValueFromInput() {
    let inputValue = valueFromInput.value;
    let resetInputValue = valueFromInput.value = '';
    if (inputValue) {
        return inputValue;
    }
    return resetInputValue;
}

function addNewTodoItem(value) {
    // const err = document.getElementById('error-msg');
    let err = getErrorMessage(value);
    if (!err) {
        state.list.unshift(
      {   title: value,
                isDone: false,
                created_at: getTodaysDate(),
                status: 'Created - ',
                icon_checkmark: {
                    icon_classes_arr: ['fas','fa-check','pointer','mr-10'],
                },
                display: ['default']
            }
            );
        // if (err) {
        //     err.remove();
        // }
    } else  {
        // errorMessage('Minimum 6 characters is required');
        displayErrorMessage(err);
    }
    render();
}

function getTodaysDate() {
    let today = new Date();
    return today.toLocaleString();
}


// TODO removeChild instead of sort on filter/remove display property from state.list and use of it for sure
function appendListItem(div, title, remove, edit, checkmark, date, status, iconCheckmarkClassesArr, display) {
    const todo = document.createElement('div');
    const iconRemove = document.createElement('i');
    const iconEdit = document.createElement('i');
    const iconCheckmark = document.createElement('i');
    const iconBox = document.createElement('div');
    const dateElement = document.createElement('span');
    const createdAt = document.createElement('div');

    dateElement.classList.add('time');
    dateElement.textContent = date;
    createdAt.classList.add('date');
    createdAt.textContent = status;
    createdAt.appendChild(dateElement);

    iconCheckmarkClassesArr.icon_classes_arr.forEach(el => {
        iconCheckmark.classList.add(el)
    })
    iconCheckmark.classList.add()
    iconCheckmark.onclick = checkmark;

    iconEdit.classList.add('far', 'fa-edit', 'pointer');
    iconEdit.onclick = edit;

    iconRemove.classList.add('far', 'fa-trash-alt', 'pointer', 'ml-10');
    iconRemove.onclick = remove;

    iconBox.classList.add('d-flex', 'f-row');
    iconBox.appendChild(iconCheckmark);
    iconBox.appendChild(iconEdit);
    iconBox.appendChild(iconRemove);

    todo.classList.add('todo', 'position-relative', 'w-100', 'd-flex', 'f-a-center', 'f-j-between');
    display.forEach(el => {
        todo.classList.add(el);
    })

    todo.textContent = title;

    todo.appendChild(createdAt);
    div.appendChild(todo);
    todo.appendChild(iconBox);
}

function removeListItem(value) {
    state.list = state.list.filter((_el, index) => {
        return value !== index;
    })
    render();
}

function getEditedTitle() {
    const editedInput = document.getElementById('editInput');
    const placeholder = editedInput.getAttribute('placeholder');

    saveEditedTitle(editedInput.value, placeholder);
}

function saveEditedTitle(editedTitle, titleFromArr) {
    const modal = document.getElementById('modal');
    // const errorMessageElement = document.createElement('div');
    // const modalErr = document.getElementById('isModalErr');

    let err = getErrorMessage(editedTitle);
    // errorMessageElement.textContent = err;
    if (!err) {
        state.list.map(el => {
            if (el.title === titleFromArr) {
                el.title = editedTitle;
                el.status = 'Edited - ';
                el.created_at = getTodaysDate();
                modal.remove();
            }
        })
        render();
    } else {
        displayErrorMessage(err);
    }
}

function displayErrorMessage(err) {
    const appBody = document.getElementById('app-body');
    const errorMessageBox = document.createElement('div');

    // errorMessageBox.classList.add('position-absolute');


    if (err) {
        setTimeout( () => {
            appBodyAppendsErrorMessageBoxAndAnimates(appBody, errorMessageBox, err)
        }, 200);
    }
}

function appBodyAppendsErrorMessageBoxAndAnimates(appBody, errBox, err) {
    errBox.classList.add('position-absolute', 'animate-err-message-fade-in');
    errBox.innerHTML = `
        <div class="error-message">${err}</div>
    `
    appBody.appendChild(errBox);
    if (errBox.classList.contains('animate-err-message-fade-in')) {
        setTimeout(() => {
            errBox.classList.add('animate-err-message-fade-out');
            setTimeout(() => {
                errBox.remove();
            }, 500);
        }, 4000)
        ;
    }
}

function getErrorMessage(editedTitle) {
    if (!editedTitle) {
        return 'Input field must be filled';
    } else if (editedTitle.length < 6) {
        return 'Title must have minimum 6 characters';
    } else if (state.list.find(el => el.title === editedTitle)) {
        return `This title already exists in your todo's list`;
    }
    return '';
}

function detectModalOutsideClickIfTrueRemove() {
    const removeModal = document.getElementById('modal');

    document.addEventListener('click', function(event) {
        if (event.target.closest('.modal')) return;
        removeModal.remove();
    }, false);
}

function editTitle(title) {
    const app = document.getElementById('app');
    let modalElement = document.createElement('div');

    modalElement.innerHTML = `
        <div class="position-absolute modal-container" id="modal">
            <div class="modal">
                <div class="modal-title">EDIT YOUR TODO</div>
                <div class="modal-current-todo" id="isModalErr">
                    <input type="text" id="editInput" class="mb-5 modal-input" placeholder="${title}">
                </div>
                <button class="btn" id="saveEditedVal" onclick="getEditedTitle()">Save</button>
            </div>
        </div>
`
    app.appendChild(modalElement);
    setTimeout(detectModalOutsideClickIfTrueRemove, 200);
}

function openModal(value) {
    state.list.filter((el, index) => {
        if (value === index) {
            editTitle(el.title);
        }
    });
}

function toggleIsDone(obj) {
    return obj.isDone = !obj.isDone;
}

function setActiveCheckmark(obj) {
    obj.isDone ? obj.icon_checkmark.icon_classes_arr.unshift('active-checkmark') : obj.icon_checkmark.icon_classes_arr.shift();
}

function checkmark(obj) {
    state.list.map(el => {
        if (el.title === obj.title) {
            toggleIsDone(obj);
            setActiveCheckmark(obj);
        }
    })
    render();
}

function generateToolsMenu() {
    const body = document.getElementById('app-body');
    const searchBox = document.createElement('div');
    const sortByStatus = document.createElement('div');
    const searchInput = document.createElement('input');
    const toolsMenu = document.createElement('div');
    const searchIcon = document.createElement('span');
    const stringSearch = document.createElement('span');

    stringSearch.textContent = ' SEARCH';
    stringSearch.classList.add('text-search');

    searchIcon.classList.add('fas', 'fa-search', 'search-icon');
    searchIcon.appendChild(stringSearch);

    searchBox.classList.add('position-relative', 'search-box');
    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchIcon);

    searchInput.classList.add('search-input');

    sortByStatus.textContent = 'FILTER BY STATUS';
    sortByStatus.classList.add('btn', 'btn-filter');
    sortByStatus.addEventListener('click', function() {
        sortTodosByStatusIsDone();
    })

    toolsMenu.id = 'tools';
    toolsMenu.appendChild(searchBox);
    toolsMenu.appendChild(sortByStatus);
    toolsMenu.classList.add('tools-menu');

    body.insertBefore(toolsMenu, body.children[1]);
}

function sortTodosByStatusIsDone() {
    // state.list.filter(el => {
    //     if (!el.isDone) {
    //         el.display.push('filtered');
    //     }
    // });
    // render();
    // state.list.sort(a,b => {
    //     console.log(a,b)
    // })
//    pameginti sort();
    state.list.sort((a,b) => {
        return b.isDone - a.isDone;
    });
    render();
    // console.log(state.list)
}

function generateList(div, list) {
    list.forEach((el, divItemIndex) => {
        appendListItem(
            div,
            el.title,
            () => removeListItem(divItemIndex),
            () => openModal(divItemIndex),
            () => checkmark(el, divItemIndex),
            el.created_at,
            el.status,
            el.icon_checkmark,
            el.display)
    })
}

function render() {
    const todos = document.getElementById('todos');
    const body = document.getElementById('app-body');
    const todoList = todos.firstElementChild;
    const newTodoListElement = document.createElement('div');
    const addNewTodoBtn = document.getElementById('add-element');
    const defaultMsg = document.getElementById('default-msg');

    if (todoList) {
        todoList.remove();
    }

    newTodoListElement.classList.add('d-flex', 'w-100', 'f-col', 'todos-list')

    todos.appendChild(newTodoListElement);

    generateList(newTodoListElement, state.list);

    body.children.length < 3 ? generateToolsMenu() : '';

    if (state.list.length === 0) {
        const toolsMenu = document.getElementById('tools')
        toolsMenu.remove();
    }

    addNewTodoBtn.onclick = () => addNewTodoItem(getValueFromInput());

    if ( state.list.length === 0 ) {
        defaultMessage(`Currently there aren't any todos`);
    } else if (defaultMsg) {
        defaultMsg.remove();
    }

    localStorage.setItem('todos', JSON.stringify(state.list));
}

render();

