'use strict';
// Global variables
let numberOfGoals;
let currentGoalId;
let goalIdToDelete;
// GET /goals
function getGoals(callback) {
    const token = localStorage.getItem('authToken');
    $.ajax({
      url: 'api/goals',
      type: 'GET',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success: function(data) {
        if(data) {
          callback(data);
        }
      },
      error: function(jqXHR, exception) {}
    });
  }

  // POST /goals
function postGoals(callback) {
    numberOfGoals++;
    
    const newGoal = $('input[id="js-add-item"]').val();
    const token = localStorage.getItem('authToken');
    $.ajax({
        url: 'api/goals',
        type: 'POST',
        dataType: 'json',
        headers: { Authorization: `Bearer ${token}` },
        contentType: 'application/json',
        data: JSON.stringify({
            goal: newGoal
        }),
        success: function(data) {
            if(data) {
                $('.js-item-count').html(`<h3 class="js-item-count col-4">Goal Count: ${numberOfGoals}</h3>`);
                $('.js-goal-list').html(`<h4>New goal: ${data.goal}</h4>`);

            }
        },
        error: function(jqXHR, exception) {}
    });
}

// PUT /goals
function putGoals(callback) {
    const token = localStorage.getItem('authToken');
    let updatedGoal = $('input[id="js-put-goal"]').val();
    $.ajax({
        url: `api/goals/${currentGoalId}`,
        type: 'PUT',
        dataType: 'json',
        headers: { Authorization: `Bearer ${token}` },
        contentType: 'application/json',
        data: JSON.stringify({
            goal: updatedGoal
        }),
        success: function(data) {
            if(data) {
                console.log(data);
                callback(data);
            }
        },
        error: function(jqXHR, exception) {}
    });
}

// Delete /goals
function deleteGoals(callback) {
    const token = localStorage.getItem('authToken');
    numberOfGoals--;
    
    $.ajax({
        url: `api/goals/${goalIdToDelete}`,
        type: 'DELETE',
        dataType: 'json',
        headers: { Authorization: `Bearer ${token}` },
        success: function(data) {
            console.log(`Successfully deleted post ${goalIdToDelete}`);
            $('.js-item-count').html(`<h3 class="js-item-count col-4">Goal Count: ${numberOfGoals}</h3>`);
            $('.js-goal-list').html(`<h4>Goal successfully deleted!</h4>`);
        },
        error: function(jqXHR, exception) {}
    });
}

// render display
function displayGoalsModal(data) {
    numberOfGoals = data.length;
    $('.js-modal').html(`
        <header>
        <h2 class="js-modal-header">I will do . . . </h2>
        </header>
        <div class="modal-body">
            <div class="get-all row js-item-count ">
                <h3 class="col-4">Goal Count: ${data.length}</h3>
            </div>
            <form class="js-form-get-goals row">
                <fieldset aria-role="group">
                    <legend>Goals</legend>
                    <div class="col-4">Want to view and edit past goals?</div>
                    <button class="js-goal-btn col-4" type="submit">Get Goals</button>
                </fieldset>
            </form>
            <form class="js-form-goal row">
                <fieldset aria-role="group">
                    <legend>Add More Goals</legend>
                    <input type="text" class="col-12" id="js-add-item" placeholder="I will walk my dog for being so cute." required>
                    <label class="col-4" for="js-add-item">Have any other plans?</label>
                    <button class="col-4 js-btn-post" type="submit" ">Add to List</button>
                </fieldset>
            </form>
  
            <div class="js-goal-list grat-list"></div>
        </div>
        <footer>
            <button class="js-modal-btn-exit">Exit</button>
        </footer>
    `);
    $('.modal').slideDown('fast');
}

function displayGoalsList(data) {
    if (data.length === 0) {
        $('.js-goal-list').html(`
        <div class="list-header">
            <h3 class="col-12">Nothing Added yet! Start adding my friend.</h3>
            <button class="js-modal-btn-close">Close</button>
         </div>
        `)
    } else {
        $('.js-goal-list').html(`
            <div class="list-header">
                <h3 class="col-12">Look how much I will accomplish!</h3>
                <button class="js-modal-btn-close">Collapse</button>
            </div>
            <ol class="js-list"></ol>  
        `);
        data.forEach((element, index) => {
            const date = convertDate(element);
            const _id = element._id;
            const goal = element.goal;
            $('.js-list').append(`
            <li class="" data-index="${index}" data-id="${_id}" data-goal="I will ${goal}">${goal} <br>${date}
                <div class="row">
                    <button class="js-update-btn col-3">Update</button>
                    <button class="js-delete-btn col-3">Delete</button>
                </div>
            </li>
            <hr>
            `); 
        });  
    }
    $('.js-goal-list').slideDown('fast');
}

function displayUpdateOption(goal) {
    $('.js-goal-list').html(`
        <form class="js-put-goal row">
            <fieldset>
                <legend><strong>${goal}</strong></legend>
                <input type="text" class="col-12" id="js-put-goal" placeholder="... update goal!" required>
                <button class="col-3" type="submit">Update</button>
            </fieldset>
        </form>  
    `);
}

function displayUpdatedGoal(data) {
    $('.js-goal-list').html(`<h4>Goal successfully updated!</h4>`);
}

  //covert the ISO date to human readable Date
function convertDate(goal) {
    let date = new Date(goal.updatedAt).toString();
    let parsedDate = date.slice(0,15);
return parsedDate;
}

// listener events

// display goal modal
$('.js-goals-btn').on('click', function() {
    getGoals(displayGoalsModal);
}); 

// exit modal
$('.modal').on('click', '.js-modal-btn-exit', function() {
    $('.modal').slideUp('fast');
}); 

// get and display all goals
$('.modal').on('click', '.js-goal-btn', function(event) {
    event.preventDefault();
    getGoals(displayGoalsList);
}); 

// close goals list
$('.modal').on('click', '.js-modal-btn-close', function() {
    $('.js-goal-list').slideUp('fast');
}); 

// POST new goal
$('.modal').on('submit', '.js-form-goal', function(event) {
    event.preventDefault();
    postGoals();
    $('input[id="js-add-item"]').val('');
});

// open update goal option
$('.modal').on('click', '.js-update-btn', function() {
    currentGoalId = $(this).closest('li').attr('data-id');
    let existingGoal = $(this).closest('li').attr('data-goal');
    console.log(existingGoal);
    displayUpdateOption(existingGoal);
});

// update with PUT request for goal and display it
$('.modal').on('submit', '.js-put-goal', function(event) {
    event.preventDefault();
    putGoals(displayUpdatedGoal);
}); 

// DELETE goal
$('.modal').on('click', '.js-delete-btn', function() {
    goalIdToDelete = $(this).closest('li').attr('data-id');
    deleteGoals();
});