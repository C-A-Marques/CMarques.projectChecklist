document.addEventListener("DOMContentLoaded", function() {
  var listsContainer = document.getElementById("listsContainer");
  var listNameInput = document.getElementById("listNameInput");
  var taskInput = document.getElementById("taskInput");
  var taskList = document.getElementById("taskList");
  var addTaskBtn = document.getElementById("addTaskBtn");
  var saveListBtn = document.getElementById("saveListBtn");
  var toggleButton = document.getElementById("toggleInstructions");
  var instructions = document.getElementById("instructions");

  // Function to create a new task list item
  function createTaskElement(task) {
    var li = document.createElement("li");
    li.textContent = task;

    // Add click event listener to toggle task completion
    li.addEventListener("click", function() {
      li.classList.toggle("completed");
    });

    var closeButton = document.createElement("span");
    closeButton.textContent = "x";
    closeButton.className = "close";

    // Add click event listener to remove task
    closeButton.addEventListener("click", function(event) {
      event.stopPropagation();
      li.remove();
    });

    li.appendChild(closeButton);

    return li;
  }

  // Function to add a new task
  function addTask() {
    var task = taskInput.value.trim();

    if (task !== "") {
      var taskElement = createTaskElement(task);
      taskList.appendChild(taskElement);
      taskInput.value = "";
    }
  }

  // Function to save the list
  function saveList() {
    var listName = listNameInput.value.trim();
    var taskItems = taskList.querySelectorAll("li");

    if (listName !== "" && taskItems.length > 0) {
      var newList = document.createElement("div");
      newList.className = "list";
      newList.innerHTML = '<h3>' + listName + '</h3>';
      var newListTasks = document.createElement("ul");

      taskItems.forEach(function(taskItem) {
        var taskClone = taskItem.cloneNode(true);
        var closeButton = taskClone.querySelector(".close");

        // Add click event listener to toggle task completion within saved list
        taskClone.addEventListener("click", function() {
          taskClone.classList.toggle("completed");
        });

        // Add click event listener to remove task within saved list
        closeButton.addEventListener("click", function(event) {
          event.stopPropagation();
          taskClone.remove();
        });

        newListTasks.appendChild(taskClone);
      });

      newList.appendChild(newListTasks);

      var closeButton = document.createElement("span");
      closeButton.textContent = "x";
      closeButton.className = "close";

      // Add click event listener to remove the entire list
      closeButton.addEventListener("click", function() {
        newList.remove();
      });

      newList.appendChild(closeButton);

      listsContainer.appendChild(newList);

      listNameInput.value = "";
      taskList.innerHTML = "";
    }
  }

  // Add click event listener to add task button
  addTaskBtn.addEventListener("click", addTask);

  // Add click event listener to save list button
  saveListBtn.addEventListener("click", saveList);

  // Add click event listener to the button
  toggleButton.addEventListener("click", function() {
  // Toggle the display property of the instructions element
  if (instructions.style.display === "none") {
    instructions.style.display = "block";
  } else {
    instructions.style.display = "none";
  }
});

});
//-------------------- Data storage functions------------------------//

// Function to save the lists to local storage
function saveListsBrowser() {
  var lists = Array.from(document.querySelectorAll(".saved-list"));
  var savedLists = [];

  lists.forEach(function (list) {
    var listName = list.querySelector(".list-name").textContent;
    var tasks = Array.from(list.querySelectorAll("li")).map(function (task) {
      return task.textContent;
    });

    savedLists.push({ listName: listName, tasks: tasks });
  });

  localStorage.setItem("savedLists", JSON.stringify(savedLists));
}

// Function to load the lists from local storage
function loadListsBrowser() {
  var savedLists = localStorage.getItem("savedLists");
  if (savedLists) {
    savedLists = JSON.parse(savedLists);

    savedLists.forEach(function (list) {
      var listElement = createSavedListElement(list.listName);

      list.tasks.forEach(function (task) {
        var taskElement = createTaskElement(task);
        listElement.querySelector(".task-list").appendChild(taskElement);
      });

      document.getElementById("savedLists").appendChild(listElement);
    });
  }
}

// Call the loadListsBrowser function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadListsBrowser();
});

// Call the saveListsBrowser function when a list is modified (new task added, task completed, or task removed)
document.getElementById("savedLists").addEventListener("click", function () {
  saveListsBrowser();
});

