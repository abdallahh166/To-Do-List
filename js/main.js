
let addBtn = document.querySelector("#addBtn")
let taskInput = document.querySelector("#taskInput")
let priorityInput = document.querySelector("#priorityInput")


let taskRemove = document.querySelector(".taskRemove")



addBtn.addEventListener("click", function () {

    addTask()
    console.log("hello")
})



let tasks = []


if (localStorage.getItem("task") != null) {
    tasks = JSON.parse(localStorage.getItem("task"))
    displayTask(tasks)
}


async function addTask() {

    let task = {
        title: taskInput.value,
        priority: priorityInput.value,
    }

    tasks.push(task)
    localStorage.setItem("task", JSON.stringify(tasks))
    displayTask(tasks)

    // Clear input fields after adding task
    taskInput.value = "";
    priorityInput.value = "High"; // Reset to default priority
}

function displayTask(array) {
    let card = ``

    for (let i = 0; i < array.length; i++) {

        const priorityColor = getPriorityColor(array[i].priority);

        card += `
            <tr>
                <td class="align-middle">
                    <div class="d-flex flex-column">
                        <span class="fw-bold taskHead">${array[i].title}</span>
                        <small class="text-muted">Added on: ${new Date().toLocaleDateString()}</small>
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