class Task{
    constructor(taskObj = { value: null, isComplete: false }){
        this.data = taskObj.value.trim(" ");
        this.isComplete = taskObj.isComplete;
    }
    newTask(){//data shall persist as Strings
        try{
            const taskList = getTasks();
            const taskObj = { data: this.data, isComplete: this.isComplete }
            taskList.push(taskObj);
            localStorage.setItem("tasks", JSON.stringify(taskList));
            createListItem(taskObj);
        } catch(e){
            return e;
        }
    }
    removeTask(){
        try{
            const taskList = getTasks();
            const newTaskList = taskList.filter(task => this.data !== task.data);
            localStorage.setItem("tasks", JSON.stringify(newTaskList));
        }catch(e){
            return e;
        }
    }
    updateStatus(){
        const taskList = getTasks();
        taskList.find(task => task.data === this.data).isComplete = this.isComplete;
        localStorage.setItem("tasks", JSON.stringify(taskList))
    }
}

function updateTaskStatus(checkBox){
    try{
        taskElement = checkBox.target.parentElement;
        const taskObj = { 
            value: taskElement.getElementsByTagName("p")[0].innerHTML,
            isComplete: checkBox.target.checked
        }
        const task = new Task(taskObj)
        task.updateStatus()
        taskElementDocorator(taskElement, task);
    }catch(e){
        console.log(e.message)
    }
}

function getTasks(){ // retrieve saved tasks from storage
    try{
        if(localStorage.getItem("tasks") !== null)
            return JSON.parse(localStorage.getItem("tasks"));
        localStorage.setItem("tasks", "[]");
        return JSON.parse(localStorage.getItem("tasks"));
    }catch(e){
        return e;
    }
}

function loadData(){ // load tasks to page on page load
    try{
        const taskList = getTasks();
        if(taskList !== null && taskList.length > 0){
            for(const task of taskList){
                createListItem(task);
            }
        }
    }catch(e){
        return e;
    }
}

function createListItem(task){ //create new task for UI
    try{
        let li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" name="checkBox">
                    <p>${task.data}</p>
                    <img src="images/trash.svg" alt="Trash icon" name="deleteBtn">`;
        li.getElementsByTagName("input")[0].checked = task.isComplete; // status of task
        taskElementDocorator(li, task);
        document.getElementsByTagName("ul")[0].appendChild(li);
    }catch(e){
        return e;
    }
}

document.addEventListener("click", e => {
    try{
        switch(e.target.name){
            case "addBtn":
                const taskObj = e.target.form[0];

                // do nothing
                if (taskObj.value.trim(" ") === "")
                    return

                const task = new Task(taskObj);
                task.newTask();

                taskObj.value = ""; //clear input box

                e.target.disabled = true; //lock add button

                filterTask(e); //// apply filter to search
                break;
            case "deleteBtn":
                deleteTask(e);
                break;
            case "checkBox":
                updateTaskStatus(e);
                break;
            default:
                break;
        }
    }catch(e){
        return e;
    }
})

function deleteTask(delBtn){
    try{
        const taskObj = {
            value: delBtn.target.parentElement.getElementsByTagName("p")[0].innerHTML
        }
        const task = new Task(taskObj);
        task.removeTask();
        delBtn.target.parentElement.parentElement.removeChild(delBtn.target.parentElement); //remove li element
    }catch(e){
        return e;
    }
}

document.getElementById("taskInputBox").addEventListener("input", e => {
    filterTask(e);
    if(e.target.value.trim(" ") === ""){

        //check empty value
        const addBtn = e.target.form[1];
        addBtn.disabled = true;
        return;
    }
    const addBtn = e.target.form[1]
    addBtn.disabled = false;
})

document.getElementById("taskInputBox").addEventListener("keydown", e => {
    const taskObj = e.target.form[0];
    if(taskObj === document.activeElement && e.keyCode === 13){
        const task = new Task(taskObj)
        task.newTask()

        taskObj.value = ""; //clear input box after submit

        e.target.form[1].disabled = true;
        e.preventDefault();
        filterTask(e);
    }
})

function taskElementDocorator(taskElement, taskObj){ // modifies task li element
    try{
        if(taskObj.isComplete){
            taskElement.getElementsByTagName("p")[0].style.textDecoration = "line-through";
            taskElement.getElementsByTagName("input")[0].checked = true;
        }else{
            taskElement.getElementsByTagName("p")[0].style.textDecoration = "none";
        }
    }catch(e){
        return e;
    }
}

function filterTask(targetTasksObj){ // filter task for search
    try{
        const tasksObjArray = document.getElementsByTagName("li");
        const targetStr = targetTasksObj.target.form[0].value.toLowerCase();
        const targetStrArray = targetStr.split(" ").filter(word => word.length > 0); 
        for(const n of tasksObjArray){
            
            //if filter array is empty
            if(targetStrArray.length === 0)
                n.style.display = "flex";

            for(const j of targetStrArray){
                if(!n.getElementsByTagName("p")[0].innerHTML.toLowerCase().includes(j)){
                    n.style.display = "none";
                }else{
                    n.style.display = "flex";
                }
            }
        }
        
    }catch(e){
        return e;
    }
}