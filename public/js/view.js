$(document).ready(function() {
    console.log("page connected.")
  // Getting a reference to the input field where user adds a new todo
  var newItemInput = $("input.new-item");
  // Our new todos will go inside the todoContainer
  var burgContainer = $(".uneaten-container");
  var eatenContainer = $(".eaten-container");
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on("click", "button.delete", deleteBurger);
  $(document).on("click", "button.devour", toggleDevour);
  $(document).on("click", ".burger-item", editBurger);
  $(document).on("keyup", ".burger-item", finishEdit);
  $(document).on("blur", ".burger-item", cancelEdit);
  $(document).on("submit", "#burger-form", insertBurger);

  // Our initial todos array
  var burgers;

  // Getting todos from database when page loads
  getBurgers();

  // This function resets the todos displayed with new todos from the database
  function initializeRows() {
    burgContainer.empty();
    eatenContainer.empty();
    var rowsToAddUn = [];
    var rowsToAddEat = [];
    for (var i = 0; i < burgers.length; i++) {
        if(burgers[i].devoured){
            rowsToAddEat.push(createNewRow(burgers[i]));
        } else {
      rowsToAddUn.push(createNewRow(burgers[i]));
    }
    burgContainer.prepend(rowsToAddUn);
    eatenContainer.prepend(rowsToAddEat);
    }
  }

  // This function grabs todos from the database and updates the view
  function getBurgers() {
    $.get("/api/burgers", function(data) {
      console.log("Burgers", data);
      burgers = data;
      initializeRows();
    });
  }

  // This function deletes a todo when the user clicks the delete button
  function deleteBurger() {
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/burgers/" + id
    })
    .done(function() {
      getBurgers();
    });
  }

  // This function sets a todos complete attribute to the opposite of what it is
  // and then runs the updateTodo function
  function toggleDevour() {
    var burger = $(this)
      .parent()
      .data("burger");

    burger.devoured = !burger.devoured;
    updateBurger(burger);
  }

  // This function handles showing the input box for a user to edit a todo
  function editBurger() {
    var currentBurger = $(this).data("burger");
    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(currentBurger.name);
    $(this)
      .children("input.edit")
      .show();
    $(this)
      .children("input.edit")
      .focus();
  }

  // This function starts updating a todo in the database if a user hits the
  // "Enter Key" While in edit mode
  function finishEdit(event) {
    var updatedBurger;
    if (event.key === "Enter") {
      updatedBurger = {
        id: $(this)
          .data("burger")
          .id,
        text: $(this)
          .children("input")
          .val()
          .trim()
      };
      $(this).blur();
      updateBurger(updatedBurger);
    }
  }

  // This function updates a todo in our database
  function updateBurger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burgers",
      data: burger
    })
    .done(function() {
      getBurgers();
    });
  }

  // This function is called whenever a todo item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentBurger = $(this).data("burger");
    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(currentBurger.name);
    $(this)
      .children("span")
      .show();
    $(this)
      .children("button")
      .show();
  }

  // This function constructs a todo-item row
  function createNewRow(burger) {
    var newInputRow = $("<li>");
    newInputRow.addClass("list-group-item burger-item");
    var newBurgerSpan = $("<span>");
    newBurgerSpan.text(burger.name);
    newInputRow.append(newBurgerSpan);
    var newBurgerInput = $("<input>");
    newBurgerInput.attr("type", "text");
    newBurgerInput.addClass("edit");
    newBurgerInput.css("display", "none");
    newInputRow.append(newBurgerInput);
    var newDeleteBtn = $("<button>");
    newDeleteBtn.addClass("delete btn d-btn");
    newDeleteBtn.text("Remove");
    newDeleteBtn.data("id", burger.id);
    var newDevourBtn = $("<button>");
    newDevourBtn.addClass("devour btn d-btn");
    if (burger.devoured) {
        newDevourBtn.text("Make Again");
    } else {
        newDevourBtn.text("Devour");
    }
    newInputRow.append(newDeleteBtn);
    newInputRow.append(newDevourBtn);
    newInputRow.data("burger", burger);
    // if (burger.devour) {
    //   newBurgerSpan.css("text-decoration", "line-through");
    // }
    return newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
 

  function insertBurger(event) {
    event.preventDefault();
    console.log("InsertBurger Exicuted");
    // if (!newItemInput.val().trim()) {   return; }
    var burger = {
      name: newItemInput
        .val()
        .trim(),
      devoured: false
    };

    // Posting the new todo, calling getTodos when done
    $.post("/api/burgers", burger, function() {
      getBurgers();
    });
    newItemInput.val("");
  }

});
