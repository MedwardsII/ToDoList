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