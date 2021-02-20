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