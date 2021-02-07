const MYAPP = {
    events: {
        addTask(taskObj){
            try{
                if(taskObj.value.trim(" ") === "")
                    return;
                
                const newTaskObj = {
                    data: taskObj.value,
                    isComplete: false
                }

                this.saveTask(newTaskObj);
                this.createListItem(newTaskObj, isCompleteDecor);

            }catch(e){
                return e;
            }
        },
        createListItem(taskObj, isCompleteDecor){ //create new task for UI
            try{
                let li = document.createElement("li");
                li.innerHTML = `<input type="checkbox" name="checkBox">
                            <p>${taskObj.data}</p>
                            <img src="images/trash.svg" alt="Trash icon" name="deleteBtn">`;
                li.getElementsByTagName("input")[0].checked = taskObj.isComplete; // status of task

                isCompleteDecor(li);

                document.getElementsByTagName("ul")[0].appendChild(li);
            }catch(e){
                return e;
            }
        },
        deleteTask(delBtn){
            try{
                const taskData = delBtn.target.parentElement.getElementsByTagName("p")[0].innerHTML;

                this.removeSavedTask(taskData);
                delBtn.target.parentElement.parentElement.removeChild(delBtn.target.parentElement); //remove li element
            }catch(e){
                return e;
            }
        },
        saveTask(newTaskObj){
            //data shall persist as Strings
            try{
                const prevTaskObj = this.getTaskData();
                prevTaskObj.push(newTaskObj);
                localStorage.setItem("tasks", JSON.stringify(prevTaskObj));
            } catch(e){
                return e;
            }
        },
        removeSavedTask(taskDataStr){
            try{
                const prevTaskObj = this.getTaskData();
                const newTaskObj = prevTaskObj.filter(task => task.data !== taskDataStr);
                localStorage.setItem("tasks", JSON.stringify(newTaskObj));
            }catch(e){
                return e;
            }
        },
        updateSavedTask(checkBox, isCompleteDecor){
            try{
                const taskDataStr = checkBox.target.parentElement.getElementsByTagName("p")[0].innerHTML;
                isCompleteDecor(checkBox);
                const prevTaskObj = this.getTaskData();
                prevTaskObj.find(data => data.data === taskDataStr).isComplete = checkBox.target.checked;
                localStorage.setItem("tasks", JSON.stringify(prevTaskObj))
                // complete update task status
            }catch(e){
                console.log(e.message)
            }
        },
        getTaskData(){
            try{
                if(localStorage.getItem("tasks") !== null)
                    return JSON.parse(localStorage.getItem("tasks"));

                localStorage.setItem("tasks", "[]");
                return JSON.parse(localStorage.getItem("tasks"));
            }catch(e){
                return e;
            }
        }
    },
}

function loadData(){ // load data on page load
    try{
        const prevTaskData = MYAPP.events.getTaskData();

        if(prevTaskData !== null && prevTaskData.length > 0){
            for(const task of prevTaskData){
                MYAPP.events.createListItem(task, isCompleteDecor);
            }
        }
    }catch(e){
        return e;
    }
}

document.addEventListener("click", e => {
    try{
        switch(e.target.name){
            case "addBtn":
                const taskDataObj = e.target.form[0]
                MYAPP.events.addTask(taskDataObj);
                taskDataObj.value = ""; //clear input box
                e.target.disabled = true; //lock add button
                filterTask(e);
                break;
            case "deleteBtn":
                MYAPP.events.deleteTask(e);
                break;
            case "checkBox":
                MYAPP.events.updateSavedTask(e, isCompleteDecor);
                break;
            default:
                break;
        }
    }catch(e){
        return e;
    }
})

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
        MYAPP.events.addTask(taskObj);
        taskObj.value = ""; //clear input box after submit
        e.target.form[1].disabled = true;
        e.preventDefault();
        filterTask(e);
    }
})

function isCompleteDecor(checkBox){
    try{
        if(checkBox.target){
            if(checkBox.target.checked){
             checkBox.target.parentElement.getElementsByTagName("p")[0].style.textDecoration = "line-through";
            }else{
                checkBox.target.parentElement.getElementsByTagName("p")[0].style.textDecoration = "none";
            }
        }else{
            if(checkBox.getElementsByTagName("input")[0].checked){
                checkBox.getElementsByTagName("p")[0].style.textDecoration = "line-through";
            }else{
                checkBox.getElementsByTagName("p")[0].style.textDecoration = "none";
            }
        }
    }catch(e){
        return e;
    }
}

function filterTask(targetTasksObj){ //func to search task
    try{
        const tasksObjArray = document.getElementsByTagName("li");
        const targetStr = targetTasksObj.target.form[0].value.toLowerCase();
        
        for(n of tasksObjArray){

            if(!n.getElementsByTagName("p")[0].innerHTML.toLowerCase().includes(targetStr)){
                n.style.display = "none";
            }else{
                n.style.display = "flex";
            }
        }
    }catch(e){
        return e;
    }
}
