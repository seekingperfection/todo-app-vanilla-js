const state =  {
    list: []
}

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

function checkIfDuplicates(value) {
    return state.list.filter(el => {
        return (el.title === value);
    }).length > 0;
}

function addNewTodoItem(value) {
    const err = document.getElementById('error-msg');
    if (value.length >= 6 && !checkIfDuplicates(value)) {
        state.list.push(
            {   title: value,
                isDone: false,
                created_at: getTodaysDate(),
                status: 'Created - ',
                icon_checkmark: {
                    icon_classes_arr: ['fas','fa-check','pointer','mr-10'],
                }
            }
            );
        if (err) {
            err.remove();
        }
    } else if (!err) {
        errorMessage('Minimum 6 characters is required');
    }
    render();
}

function getTodaysDate() {
    let today = new Date();
    return today.toLocaleString();
}

function appendListItem(div, title, remove, edit, checkmark, date, status, iconCheckmarkClassesArr) {
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

function returnEditedTitle() {
    const editedInput = document.getElementById('editInput');
    const placeholder = editedInput.getAttribute('placeholder');

    saveEditedTitle(editedInput.value, placeholder);
}

function saveEditedTitle(editedTitle, titleFromArr) {
    const removeModal = document.getElementById('modal');
    // const modalContent = document.getElementById('modalContent');


    const err = document.createElement('div');
    state.list.map(el => {
       // modalContent.appendChild(err);
       //
       //  if (editedTitle.length < 6) {
       //      err.textContent = 'Minimum 6 characters is required';
       //      modalContent.appendChild(err);
       //  } else if ( el.title === editedTitle ) {
       //      err.textContent = 'This todo already exists';
       //      modalContent.appendChild(err);
       //  } else {
       //  if (el.title === titleFromArr) {
       //      el.title = editedTitle;
       //      el.status = 'Edited - ';
       //      el.created_at = getTodaysDate();
       //      removeModal.remove();
       //      render();
       //  }
        if (editedTitle.length < 6) {
            console.log('way tooo short');
            console.log(el);
        } else if (editedTitle) {
            let x = [];
            x.push(el.title);
            if (x.find(title => title === editedTitle)) {
                console.log(x, 'asdf')
            } else {
                console.log('testtest')
            }
        }






        // } else if ( el.title === editedTitle ) {
        //     err.textContent = 'This todo already exists';
        //     modalContent.appendChild(err);
        //     if (el.title === titleFromArr) {
        //         el.title = editedTitle;
        //         el.status = 'Edited - ';
        //         el.created_at = getTodaysDate();
        //     }
        // } else {
        //     console.log('cbb?')

            // el.title = editedTitle;
                // el.status = 'Edited - ';
                // el.created_at = getTodaysDate();
                // render();
        // }

    })
    // render();
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
            <div class="modal" id="modalContent">
                <div class="modal-title">EDIT YOUR TODO</div>
                <div class="modal-current-todo">
                    <input type="text" id="editInput" class="mb-5 modal-input" placeholder="${title}">
                    Your current todo
                </div>
                <button class="btn" id="saveEditedVal" onclick="returnEditedTitle()">Save</button>
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
            el.icon_checkmark)
    })
}

function render() {
    const todos = document.getElementById('todos');
    const todoList = todos.firstElementChild;

    if (todoList) {
        todoList.remove();
    }

    const newTodoListElement = document.createElement('div');
    newTodoListElement.classList.add('d-flex', 'w-100', 'f-col', 'todos-list')
    todos.appendChild(newTodoListElement);
    generateList(newTodoListElement, state.list);

    const addNewTodoBtn = document.getElementById('add-element');
    addNewTodoBtn.onclick = () => addNewTodoItem(getValueFromInput());

    const defaultMsg = document.getElementById('default-msg');
    if ( state.list.length === 0 ) {
        defaultMessage(`Currently there aren't any todos`);
    } else if (defaultMsg) {
        defaultMsg.remove();
    }
}

render();

