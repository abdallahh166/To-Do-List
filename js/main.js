let addBtn = document.querySelector("#addBtn")
let saveBtn = document.querySelector(".saveBtn")

let taskInput = document.querySelector("#taskInput")
let priorityInput = document.querySelector("#priorityInput")


addBtn.addEventListener("click", function () {
    addTask()
})

let tasks = []

if (localStorage.getItem("task") != null) {
    tasks = JSON.parse(localStorage.getItem("task"))
    displayTask(tasks)
}

async function addTask() {

    let title = taskInput.value;
    let regex = {
        title: /^[a-zA-Z][a-zA-Z0-9_ ]{5,20}$/ 
    };

    // Check if the title matches the regex pattern
    if (!regex.title.test(title.trim())) {
        swal("Title must be between 5 and 20 characters long, and start with a letter.");
        return;
    }

    let task = {
        title: title,
        priority: priorityInput.value,
        done: false, // Add this property to track the completion status
        addedOn: new Date().toLocaleDateString()
    }

    tasks.push(task)
    localStorage.setItem("task", JSON.stringify(tasks))
    displayTask(tasks)

    // Clear input fields after adding task
    taskInput.value = "";
    priorityInput.value = "Low"; // Reset to default priority
}

function displayTask(array) {
    let card = ``

    for (let i = 0; i < array.length; i++) {

        const priorityColor = getPriorityColor(array[i].priority);
        // If the task is done, apply the text-decoration-line-through class
        const doneClass = array[i].done ? 'text-decoration-line-through' : '';

        card += `
            <tr>
                <td class="align-middle">
                    <div class="d-flex flex-column">
                        <span class="fw-bold taskHead ${doneClass}">${array[i].title}</span>
                        <small class="text-muted">Added on: ${array[i].addedOn}</small>
                    </div>
                </td>

                <td class="align-middle text-center">
                    <h6 class="mb-0">
                        <span class="badge ${priorityColor} taskPriority">${array[i].priority}</span>
                    </h6>
                </td>

                <td class="align-middle text-center">
                    <div class="d-flex justify-content-around">
                        <a href="#!" data-index="${i}" class="taskDone" title="Mark as Done">
                            <i class="fas fa-check fa-lg text-success"></i>
                        </a>
                        <a href="#!" data-index="${i}" class="taskRemove" title="Remove Task">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                        <a href="#!" data-index="${i}" class="taskEdit" title="Edit Task">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                    </div>
                </td>
            </tr>

        `
    }
    document.querySelector(".tableRowData").innerHTML = card

}


// Function to get Bootstrap badge color based on priority
function getPriorityColor(priority) {
    if (priority === "High") return "bg-danger";
    if (priority === "Medium") return "bg-warning";
    if (priority === "Low") return "bg-success";
    return "bg-secondary";
}

let editIndex = null;

document.querySelector(".tableRowData").addEventListener("click", function (e) {
    if (e.target.closest(".taskEdit")) {
        const index = e.target.closest(".taskEdit").getAttribute("data-index");
        setFromValueUpdate(index)

        saveBtn.classList.replace("d-none", "d-flex")
        addBtn.classList.add("d-none")


        editIndex = index;
    }
})

function setFromValueUpdate(index) {

    taskInput.value = tasks[index].title
    priorityInput.value = tasks[index].priority

     // Toggle Button Visibility
     saveBtn.classList.replace("d-none","d-flex");
     addBtn.classList.add("d-none");
     editIndex = index;
}

document.querySelector("#saveBtn").addEventListener("click", function () {
    if (editIndex !== null) {
        editTask(editIndex);
        editIndex = null; //why intial it by null and clear it by null in the end?
        //It ensures that the next edit doesn't mistakenly use the previous task's index.
        resetButtonState()

    }
});

function editTask(index) {

    let title = taskInput.value.trim();

    // Validate Task Title
    let regex = /^[a-zA-Z][a-zA-Z0-9_ ]{3,20}$/;
    if (!regex.test(title)) {
        swal("Title must be between 5 and 20 characters long, and start with a letter.");
        return;
    }

    let updatedTasks = {
        title: title,
        priority: priorityInput.value,
        done: tasks[index].done, // Keep the 'done' status intact
        addedOn: tasks[index].addedOn // Retain original creation date

    }

    tasks.splice(index, 1, updatedTasks)

    // Save the updated tasks array to localStorage
    localStorage.setItem("task", JSON.stringify(tasks));

    // Re-render the task list
    displayTask(tasks);

    // Clear the input fields after saving
    taskInput.value = "";
    priorityInput.value = "Low"; // Reset to default priority
}

function resetButtonState() {
    saveBtn.classList.add("d-none");
    addBtn.classList.remove("d-none");
    editIndex = null; // Reset edit index
}

// Add event delegation for task removal
document.querySelector(".tableRowData").addEventListener("click", function (e) {
    if (e.target.closest(".taskRemove")) {
        const index = e.target.closest(".taskRemove").getAttribute("data-index");
        deleteTask(index); // Pass the index to deleteTask function
    }
});

function deleteTask(index) {

    tasks.splice(index, 1)
    localStorage.setItem("task", JSON.stringify(tasks))
    displayTask(tasks)

}

document.querySelector(".tableRowData").addEventListener("click", function (e) {
    if (e.target.closest(".taskDone")) {
        const index = e.target.closest(".taskDone").getAttribute("data-index");
        doneTask(index);
    }
})

function doneTask(index) {

    // Toggle the 'done' status (mark as done or undo done)
    tasks[index].done = !tasks[index].done;
    
    localStorage.setItem("task", JSON.stringify(tasks));
    displayTask(tasks);

}