let to = JSON.parse(localStorage.getItem("todos")) || [];

todolist();

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(to));
}

function todolist() {
    let todohtml = "";
    for (let i = 0; i < to.length; i++) {
        const todoobject = to[i];
        const name = todoobject.name;
        const duedate = todoobject.duedate;
        const html = `<div>${name}</div>
        <div>${duedate}</div>
        <button onclick="deleteTodo(${i})">Delete</button>
`;
        todohtml += html;
    }
    document.querySelector(".z").innerHTML = todohtml;
}

function deleteTodo(i) {
    to.splice(i, 1);
    saveTodos();
    todolist();
}

function addtodo() {
    const u = document.querySelector("#r");
    const y = u.value;
    const datee = document.querySelector('.b');
    const duedaate = datee.value;
    if (!y) return;
    to.push({
        name: y,
        duedate: duedaate
    });
    saveTodos();
    u.value = "";
    todolist();
}
