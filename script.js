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
    closeButton.textContent = "X";
    closeButton.className = "close";

    // Add click event listener to remove task
    closeButton.addEventListener("click", function(event) {
      event.stopPropagation();
      
      var newListDiv = li.parentNode.parentNode;
      var newListDivExists = newListDiv.classList.contains('list');
      
      li.remove();
      
      if (newListDivExists) {
        saveListToStorage(newListDiv);
      }

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
      let newListTasks = document.createElement("ul");

      var secondaryInputTasks = newList.querySelectorAll("input[type=text]");
      var secondaryTasks = Array.from(secondaryInputTasks).map(function(input) {
        return input.value.trim();
      });



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
          saveListToStorage(newList);
          
        });

        newListTasks.appendChild(taskClone);
      });

      newList.appendChild(newListTasks);

      var closeButton = document.createElement("span");
      closeButton.textContent = "X";
      closeButton.className = "close";

      // Add click event listener to remove the entire list
      closeButton.addEventListener("click", function() {
        newList.remove();
        saveListToStorage(newList);
      });

      newList.appendChild(closeButton);

      // Add task input and button to add tasks to existing lists

      var addTaskInput = document.createElement("input");
      addTaskInput.setAttribute("type", "text");
      addTaskInput.setAttribute("placeholder", "Add an extra task");
      newList.appendChild(addTaskInput);

      var addTaskButton = document.createElement("button");
      addTaskButton.textContent = "Add Task";
      addTaskButton.className ="buttonStandard";
      addTaskButton.addEventListener("click", function() {
      var task = addTaskInput.value.trim();
      if (task !== "") {
        var taskElement = createTaskElement(task);
        newListTasks.appendChild(taskElement);
        addTaskInput.value = "";
      }
    });

      newList.appendChild(addTaskButton);

      listsContainer.appendChild(newList);

      listNameInput.value = "";
      taskList.innerHTML = "";

      saveListToStorage(newList);
    }
  }

//-------------------- Data storage functions------------------------//

  // Function to save the list to localStorage

  function saveListToStorage(list) {
    var listName = list.querySelector("h3").textContent;
    var taskItems = list.querySelectorAll("li");
    var tasks = [];
  
    taskItems.forEach(function(taskItem) {
      tasks.push(taskItem.textContent.slice(0, -1)); // Remove the "x" character before saving
    });
  
    var secondaryInputTasks = list.querySelectorAll("input[type=text]");
    var secondaryTasks = Array.from(secondaryInputTasks).map(function(input) {
      return input.value.trim();
    });
  
    secondaryInputTasks.forEach(function(input) {
      var task = input.value.trim();
      if (task !== "") {
        secondaryTasks.push(task);
      }
    });
  
    var storedList = {
      name: listName,
      tasks: tasks,
      secondaryTasks: secondaryTasks // Store the tasks from the secondary input fields
    };
    
    
  
    var savedLists = getSavedListsFromStorage();
    
    let existsTask =  savedLists.some(tList => tList.name == listName);
    if (existsTask) {
      //Eciste por isso Update
      let taskAlreadyExistsIndex = savedLists.findIndex(tList => tList.name == listName);
      savedLists[taskAlreadyExistsIndex] = storedList;
    }
    else {
      // Não existe por isso Add
      savedLists.push(storedList);
    }

    //savedLists.push(storedList); // Rework into a new function and use "update" instead of "push" - 
    // Find object index and replace it 

    // Problem: Using "update" requires the use a function that returns a "Promise" (?)
    // Proposal:
       /* function testProposal(savedLists, storedList) {
        let indexSearch = savedLists.findIndex(function(list) {
          return list.name === savedLists.name;
        });
        if(indexSearch != -1) {
          savedList[indexSearch] = storedList;
        } else {
          savedLists.push(storedList);
        }
      }

      testProposal(savedLists, storedList); */

      // End of Proposal
    localStorage.setItem("savedLists", JSON.stringify(savedLists));
  }
  
  
// Function to load secondary inputs

function loadSecondaryInputs(storedList, newList) {
  var secondaryTasks = storedList.secondaryTasks || [];
  let newListTasks = document.createElement("ul");;
  secondaryTasks.forEach(function(task) {
    var taskElement = createTaskElement(task);
    newListTasks.appendChild(taskElement);
  });

  var addTaskInput = newList.querySelector("input[type=text]");
  var addTaskButton = newList.querySelector("button.buttonStandard");

  addTaskButton.addEventListener("click", function() {
    var task = addTaskInput.value.trim();
    if (task !== "") {
      var taskElement = createTaskElement(task);
      newListTasks.appendChild(taskElement);
      addTaskInput.value = "";
    }
  });
}





  

// Function to retrieve saved lists from localStorage
function getSavedListsFromStorage() {
  var savedLists = localStorage.getItem("savedLists");
  return savedLists ? JSON.parse(savedLists) : [];
}


// Load saved lists from localStorage on page load
  // Function to load saved lists from localStorage on page load
  function loadSavedLists() {
    var savedLists = getSavedListsFromStorage();
  
    savedLists.forEach(function(storedList) {
      var newList = document.createElement("div");
      newList.className = "list";
      newList.innerHTML = '<h3>' + storedList.name + '</h3>';
      var newListTasks = document.createElement("ul");
  
      storedList.tasks.forEach(function(task) {
        var taskText = task.endsWith("x") ? task.slice(0, -1) : task;
        var taskElement = createTaskElement(taskText);
        newListTasks.appendChild(taskElement);
      });
  
      newList.appendChild(newListTasks);
  
      var closeButton = document.createElement("span");
      closeButton.textContent = "X";
      closeButton.className = "close";
  
      // Add click event listener to remove the entire list
      closeButton.addEventListener("click", function() {
        newList.remove();
        removeListFromStorage(storedList);
      });
  
      newList.appendChild(closeButton);
  
      var addTaskInput = document.createElement("input");
      addTaskInput.setAttribute("type", "text");
      addTaskInput.setAttribute("placeholder", "Add an extra task");
      newList.appendChild(addTaskInput);
  
      var addTaskButton = document.createElement("button");
      addTaskButton.textContent = "Add Task";
      addTaskButton.className = "buttonStandard";
  
      addTaskButton.addEventListener("click", function() {
        
        var task = addTaskInput.value.trim();
        if (task !== "") {
          var taskElement = createTaskElement(task);
          newListTasks.appendChild(taskElement);
          addTaskInput.value = "";
          let parentList = newListTasks.parentNode;
          saveListToStorage(parentList);
        }
      });
  
      newList.appendChild(addTaskButton);
  
      listsContainer.appendChild(newList);
  
      // Populate secondary input fields
      loadSecondaryInputs(storedList, newList);
  
      // Update the input value to avoid adding an empty task
      addTaskInput.value = "";
    });
  }
  
  

// Function to remove a list from localStorage
function removeListFromStorage(list) {
  var savedLists = getSavedListsFromStorage();
  var index = savedLists.findIndex(function(storedList) {
    return storedList.name === list.name;
  });

  if (index !== -1) {
    savedLists.splice(index, 1);
    localStorage.setItem("savedLists", JSON.stringify(savedLists));
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
  loadSavedLists();
});