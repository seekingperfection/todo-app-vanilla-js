// import './SmoothLib.css';

const state =  {
    list: []
}

const todos = document.getElementById('todos');
const valueFromInput = document.getElementById('enter-item-title');

// Lets add new item after we click 'Enter'
valueFromInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addNewTodoItem(getValueFromInput());
        // render();
    }
});

function errorMessage(value) {
    const errorBox = document.getElementById('error-box')
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('text-red', 'error-message');
    errorMessage.id = 'error-msg';
    errorMessage.textContent = value;
    errorBox.appendChild(errorMessage);
    // todos.appendChild(error);
}

function defaultMessage(value) {
    const defaultBox = document.getElementById('default-box');
    const defaultMessage = document.createElement('div');
    defaultMessage.id = 'default-msg';
    defaultMessage.classList.add('default-message', 'mb-10');
    defaultMessage.textContent = value;
    defaultBox.appendChild(defaultMessage);
}

// defaultMessage('Nothing to show');

function getValueFromInput() {
    let inputValue = valueFromInput.value;
    let resetInputValue = valueFromInput.value = '';
    if (inputValue) {
        return inputValue;
    }
    return resetInputValue;
}

function checkIfDuplicates(value) {
    console.log('pacallinta?');
    return state.list.filter(function (el) {
        return (el.title === value);
    }).length > 0;
}

function addNewTodoItem(value) {
    const app = document.getElementById('app');
    const err = document.getElementById('error-msg');
    console.log(checkIfDuplicates(value), ' tikriname');
    if (value.length >= 6 && !checkIfDuplicates(value)) {
        state.list.push({title: value, status: false});
        if (err) {
            err.remove();
        }
    } else if (!err) {
        errorMessage('Minimum 6 characters is required');
    }
    render();
}

function appendListItem(div, title, remove, edit) {
    const todo = document.createElement('div');
    const iconRemove = document.createElement('i');
    const iconEdit = document.createElement('i');
    const iconCheck = document.createElement('i');
    const iconBox = document.createElement('div');

    iconBox.classList.add('d-flex', 'f-row');
    // iconBox.appendChild(iconEdit,iconRemove);
    iconBox.appendChild(iconEdit);
    iconBox.appendChild(iconRemove);

    iconEdit.classList.add('far', 'fa-edit', 'pointer');
    iconEdit.onclick = edit;

    iconRemove.classList.add('far', 'fa-trash-alt', 'pointer', 'ml-10');
    iconRemove.onclick = remove;

    todo.classList.add('todo', 'w-100', 'd-flex', 'f-a-center', 'f-j-between');
    todo.textContent = title;

    div.appendChild(todo);
    todo.appendChild(iconBox);
}

function removeListItem(value) {
    state.list = state.list.filter((_el, index) => {
        return value !== index;
    })
    render();
}


//Negrazina titlo nx

function returnEditedTitle() {
    const editedInput = document.getElementById('editInput');
    const placeholder = editedInput.getAttribute('placeholder');
    const removeModal = document.getElementById('modal');
    saveEditedTitle(editedInput.value, placeholder);
    removeModal.remove();
}

function saveEditedTitle(editedTitle, titleFromArr) {
    state.list.map(el => {
        if (el.title === titleFromArr) {
            el.title = editedTitle;
        }
    })
    // console.log(state.list);
    render();

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
    console.log('swx swx swx')
    let modalElement = document.createElement('div');
    const test = document.getElementById('test');
    // let x = title;
    // test.addEventListener('click', returnEditedTitle);

    modalElement.innerHTML = `
        <div class="position-absolute modal-container" id="modal">
            <div class="modal" id="modal">
                <div class="modal-title title mb-20">EDIT YOUR TODO</div>
                <div class="modal-current-todo mt-20 mb-10">Your current todo</div>
                <input type="text" id="editInput" class="mb-20 modal-input" placeholder="${title}">
                <button class="btn" id="test" onclick="returnEditedTitle()">Save</button>
            </div>
        </div>
`
    app.appendChild(modalElement);
    setTimeout(detectModalOutsideClickIfTrueRemove, 200);
}
//
// function testin() {
//     console.log('asdfasdf')
// }
// callModal();

function openModal(value) {
    const isModal = document.getElementById('modal');
    const app = document.getElementById('app');

    state.list.filter((el, index) => {
        if (value === index) {
            // console.log(el.title, 'martnui tailtl;as')
            editTitle(el.title);
        }
    });
    // render();
}

function generateList(div, list) {
    // console.log(list);
    list.forEach((divTextContent, divItemIndex) => {
        appendListItem(div, divTextContent.title, () => removeListItem(divItemIndex), () => openModal(divItemIndex))
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
        defaultMessage(`Currently there aren't any todos`)
    } else if (defaultMsg) {
        defaultMsg.remove();
    }
}


render();

