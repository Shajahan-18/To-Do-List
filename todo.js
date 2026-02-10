let to =[];
        


        todolist();
        function todolist() {
            let todohtml = "";

            for (let i = 0; i < to.length; i++) {
                const todoobject = to[i];
                const name=todoobject.name;
                const duedate=todoobject.duedate;

                const html = `<div>${name}</div>
                <div>${duedate}</div>
                <button onclick="deleteTodo(${i})">Delete</button>
` ;
                todohtml += html;
            }
            
            document.querySelector(".z").innerHTML = todohtml;
        }
        function deleteTodo(i) {
                to.splice(i, 1);
                todolist();
            }




        function addtodo() {
            const u = document.querySelector("#r");
            const y = u.value;
            const datee=document.querySelector('.b')
            const duedaate=datee.value

            to.push({
                name:y,
                duedate:duedaate
            });
            
            u.value = "";
            todolist();


        }
