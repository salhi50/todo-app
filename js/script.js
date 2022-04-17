// variables
const upBarControl = document.querySelectorAll(".up-bar .item");
const barItems = document.querySelectorAll(".item-bar");
const errorForm = document.getElementById("error-form")

// call the function show pending lists to do
showPending();
showCompleted();

// up bar
upBarControl.forEach(function(bar, index){
    bar.addEventListener("click", function(e){
        upBarControl.forEach(function(item){
            item.classList.remove("active");// remove all class active when we press in a item from the up bar
        })
        e.currentTarget.classList.add("active");
        errorForm.classList.add("d-none");
        barItems.forEach(function(one){
            one.classList.remove("active");
        })
        barItems[index].classList.add("active");
    })  
})

// importance

const impOptions = document.querySelectorAll(".importance .select-import .item");

impOptions.forEach(function(ele, ind){ // add active to the element when we press
    ele.addEventListener("click", function(){
        impOptions.forEach(function(imp){
            imp.classList.remove("active");
        })
        impOptions[ind].classList.add("active")
    })
})

// select colors

const selectColors = document.querySelectorAll(".select-colors .list-of-colors .item");

selectColors.forEach(function(color, index){
    color.addEventListener("click", function(e){ // add an active class when we choose a color
        selectColors.forEach(function(one){
            one.classList.remove("active")
        })
        selectColors[index].classList.add("active");
    })
})

// description

const descContent = document.getElementById("desc-content");
const maxLength = document.getElementById("max-length");

descContent.addEventListener("input", function(e){
    var desc = descContent.value.trim().replaceAll(" ", "").split("");
    maxLength.innerHTML = desc.length;
    if(desc.length === 150 || descContent.length > 150){
        maxLength.innerHTML = "max";
        descContent.value = descContent.value.slice(0,-1);
    }
})

// delete an item from the list

const trashIcon = document.querySelectorAll(".ul-list-pending i.trash");
const deleteHover = document.querySelectorAll(".ul-list-pending span.hover-text");


trashIcon.forEach(function(icon, index){
    icon.addEventListener("mouseover", function(){ // apply hover effect for each icon trash
        deleteHover[index].classList.add("active"); // show delete span hover
    })
    icon.addEventListener("mouseout", function(){ // remove hover effect
        deleteHover[index].classList.remove("active");  // hide the delete span
    })
})

// start with local storage

const btnAdd = document.getElementById("btn-add");
const inputNameList = document.getElementById("mission-name");
// id already declared : descContent
const durationInput = document.getElementById("duration-input");


// duration input
function onlyNumbers(){ // input must must have only numbers
    if(Number.isNaN(durationInput.value * 1) === true){
        durationInput.value = durationInput.value.trim().slice(0,-1);
    }
    else if(Number.isNaN(durationInput.value * 1) === false){
        durationInput.value = durationInput.value.replaceAll(" ","").trim();
    }
}
durationInput.addEventListener("input", onlyNumbers) // add function to test if the input have numbers
 
// add time
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date+' '+time;

// test info user if it fill all the blanks
function testInfo(){
    // variables to get the select option in duration 
    var select = document.querySelector("select");
    var options = Array.from(select.selectedOptions); 
    // style btn add a opacity  
    btnAdd.style.opacity = ".7";
    setTimeout(() => { // set the time after 2s
        // check if all the inputs not blank
        if(inputNameList.value.trim() === "" || descContent.value.trim() === ""){ 
            errorForm.classList.remove("d-none"); // show the errorform
            btnAdd.style.opacity = "1";
        }
        else{
        // return the opacity to add btn
        location.reload();
        btnAdd.style.opacity = "1"
        errorForm.classList.add("d-none"); // hide the errorform
        // start the storage            
        let getLocal = localStorage.getItem("todo");    
        var obj = {
            listName: inputNameList.value,
            duration: `${durationInput.value}${options[0].value}`,
            detail: descContent.value,
            time: dateTime,
        }
        selectColors.forEach(function(color){
            if(color.classList.contains("active")){
                obj.colorTask = `${color.getAttribute("data-color")}`
            }
        })
        impOptions.forEach(function(im){
            if(im.classList.contains("active")){
                obj.importance = `${im.getAttribute("data-imp")}`
            }
        })
        // check if the local storage is null
        if(getLocal == null){ // create a new array
            var arrList = [];
        }
        else{ // transfert the array string to array
            arrList = JSON.parse(getLocal);
        }
        arrList.push(obj); // push the object that has the informations
        localStorage.setItem("todo", JSON.stringify(arrList)); // set the arra to the local storage
        showPending();
        }
    }, 2000)
}
// add event click to the btnAdd
btnAdd.addEventListener("click", testInfo);


// function to show pending missions
function showPending(){
    var pendingLists = document.querySelector("ul.ul-list-pending")
    let getLocal = localStorage.getItem("todo");
    if(getLocal == null){ // blank the array
        arrList = [];
    }
    else{ // transfert the array string to array
        arrList = JSON.parse(getLocal);
    }
    let testing = '';
    arrList.forEach(function(element, ind){
        testing += `
        <li class="flex flex-between mgy-half-1rem full-width cursor show-modal-info" style="border-left: 5px solid ${element.colorTask};">  
        <div class="text o-hidden fl-1" onclick="infoModal(${ind})">
           <!-- add this:  max 30 -->
          <h6 class="test line-clamp">${element.listName}</h6>
          <span class="gray-color text-ellipsis d-block">${element.time}</span>
        </div>
        <div class="icons flex align-center relative">
          <span class="p-small hover-text d-hidden absolute">Delete</span>
          <i class="fa fa-trash trash pdx-15 gray-color cursor" onclick="deleteTask(${ind})"></i>
        </div>
      </li>
        `
    })
    pendingLists.innerHTML += testing;
}


// show modal function

// show modal 

const parentModal = document.getElementById("parentModal");
const mainModal = document.getElementById("mainModal");
const okBtns = document.querySelectorAll(".ok-button")
const showModalInfo = document.querySelectorAll("li.show-modal-info");
// variables info modal
const taskName = document.getElementById("task-name");
const taskDetail = document.getElementById("task-detail");
const taskDuration = document.getElementById("task-duration");
const taskImport = document.getElementById("task-import");
const taskColor = document.getElementById("taskColor");

// show the main modal
function infoModal(ind){
    parentModal.classList.remove("d-none");
    mainModal.classList.add("active");
    let getLocal = localStorage.getItem("todo");
    arrList = JSON.parse(getLocal);
    taskName.innerHTML = arrList[ind].listName; //task name
    taskDuration.innerHTML = arrList[ind].duration; //task duration
    taskDetail.innerHTML = arrList[ind].detail; //task detail
    taskColor.innerHTML = arrList[ind].colorTask; //task color
    taskColor.style.color = "#fff"; // add white color
    taskColor.style.backgroundColor = arrList[ind].colorTask; //add bgtask
    taskImport.innerHTML = arrList[ind].importance;
}
function compledInfo(ind){
    let getIt = localStorage.getItem("completed");
    parentModal.classList.remove("d-none");
    mainModal.classList.add("active");
    arrComp = JSON.parse(getIt);
    taskName.innerHTML = arrComp[ind].listName; //task name
    taskDuration.innerHTML = arrComp[ind].duration; //task duration
    taskDetail.innerHTML = arrComp[ind].detail; //task detail
    taskColor.innerHTML = arrComp[ind].colorTask; //task color
    taskColor.style.color = "#fff"; // add white color
    taskColor.style.backgroundColor = arrComp[ind].colorTask; //add bgtask
    taskImport.innerHTML = arrComp[ind].importance;
}

// function to add the task to the completed mission
function deleteTask(ind){
    let getCompl = localStorage.getItem("completed");
    if(getCompl == null){ // create a new array
        arrComp = [];
    }
    else{ // transfert the array string to array
        arrComp = JSON.parse(getCompl);
    }
    let getLocal = localStorage.getItem("todo");
    arrList = JSON.parse(getLocal);
    arrComp.push(arrList[ind]);
    arrList.splice(ind, 1);
    localStorage.setItem("completed", JSON.stringify(arrComp));
    localStorage.setItem("todo", JSON.stringify(arrList));
    showCompleted();
    location.reload();
}

// ok btn add event click to hide the modal
okBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
        parentModal.classList.add("d-none");
        mainModal.classList.remove("active");
    })
})

// show completed missions


function showCompleted(){
    var compledLists = document.querySelector("ul.ul-list-completed");
    let getLocal = localStorage.getItem("completed");
    if(getLocal == null){ // blank the array
        arrComp = [];
    }
    else{ // transfert the array string to array
        arrComp = JSON.parse(getLocal);
    }
    let testing = '';
    arrComp.forEach(function(element, ind){
        testing += `
        <li class="flex flex-between mgy-half-1rem full-width cursor show-modal-info" style="border-left: 5px solid ${element.colorTask};">  
        <div class="text o-hidden fl-1" onclick="compledInfo(${ind})">
           <!-- add this:  max 30 -->
          <h6 class="test line-clamp">${element.listName}</h6>
          <span class="gray-color text-ellipsis d-block">${element.time}</span>
        </div>
        <div class="icons flex align-center relative">
          <span class="p-small hover-text d-hidden absolute">Delete</span>
          <i class="fa fa-check pdx-15 cursor" style="color: green;"></i>
        </div>
      </li>
        `
    })
    compledLists.innerHTML += testing;
}

let pendingMissions = document.querySelector("ul.ul-list-pending");
let completedMissions = document.querySelector("ul.ul-list-completed");
let emptyTasks = document.getElementById("emptyTasks");
let emptyComleted = document.getElementById("emptyComleted");
const clearPendings = document.getElementById("clearPendings");
const clearCompleted = document.getElementById("clearCompleted");
if(pendingMissions.childElementCount == 0){
    emptyTasks.classList.remove("d-none");
}
else{
    emptyTasks.classList.add("d-none");
    // clear pending missions
    clearPendings.addEventListener("click", function(){
    location.reload();
    localStorage.removeItem("todo");
})
}
if(completedMissions.childElementCount == 0){
    emptyComleted.classList.remove("d-none");
}
else{
    emptyComleted.classList.add("d-none");
    // start clear items from completed
    clearCompleted.addEventListener("click", function(){
        localStorage.removeItem("completed");
        location.reload();
    })
}

// show length lists 

const numCompleted = document.getElementById("numCompleted");
const numPending = document.getElementById("numPending");

numPending.innerHTML = pendingMissions.childElementCount;
numCompleted.innerHTML = completedMissions.childElementCount;

// end

