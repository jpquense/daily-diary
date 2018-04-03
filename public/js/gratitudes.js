'use strict';
// Global variables
let numberOfGratitudes;
let currentGratitudeId;
let gratitudeIdToDelete;
// GET /gratitudes
function getGratitudes(callback) {
    const token = localStorage.getItem('authToken');
    $.ajax({
      url: 'api/gratitudes',
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

  // POST /gratitudes
function postGratitudes(callback) {
    numberOfGratitudes++;
    
    const newGratitude = $('input[id="js-add-item"]').val();
    const token = localStorage.getItem('authToken');
    $.ajax({
        url: 'api/gratitudes',
        type: 'POST',
        dataType: 'json',
        headers: { Authorization: `Bearer ${token}` },
        contentType: 'application/json',
        data: JSON.stringify({
            gratitude: newGratitude
        }),
        success: function(data) {
            if(data) {
                callback(data);
                $('.js-item-count').html(`<h3 class="js-item-count col-4">Gratitude Count: ${numberOfGratitudes}</h3>`);
            }
        },
        error: function(jqXHR, exception) {}
    });
}

// PUT /gratitudes
function putGratitudes(callback) {
    const token = localStorage.getItem('authToken');
    let updatedGratitude = $('input[id="js-update-item"]').val();
    $.ajax({
        url: `api/gratitudes/${currentGratitudeId}`,
        type: 'PUT',
        dataType: 'json',
        headers: { Authorization: `Bearer ${token}` },
        contentType: 'application/json',
        data: JSON.stringify({
            gratitude: updatedGratitude
        }),
        success: function(data) {
            if(data) {
                callback(data);
            }
        },
        error: function(jqXHR, exception) {}
    });
}

// Delete /gratitudes
function deleteGratitudes(callback) {
    const token = localStorage.getItem('authToken');
    numberOfGratitudes--;
    
    $.ajax({
        url: `api/gratitudes/${gratitudeIdToDelete}`,
        type: 'DELETE',
        dataType: 'json',
        headers: { Authorization: `Bearer ${token}` },
        success: function(data) {
            console.log(`Successfully deleted post ${gratitudeIdToDelete}`);
            $('.js-item-count').html(`<h3 class="js-item-count col-4">Gratitude Count: ${numberOfGratitudes}</h3>`);
            $('.js-grat-list').html(`<h4>Gratitude successfully deleted!</h4>`);
        },
        error: function(jqXHR, exception) {}
    });
}

// render display
function displayGratitudesModal(data) {
    numberOfGratitudes = data.length;
    $('.js-modal').html(`
        <header>
        <h2 class="js-modal-header">I am grateful for . . . </h2>
        </header>
        <div class="modal-body">
            <div class="get-all row js-item-count ">
                <h3 class="col-4">Gratitude Count: ${data.length}</h3>
            </div>
            <form class="js-form-get-gratitudes row">
                <fieldset aria-role="group">
                    <legend>Gratitudes</legend>
                    <label class="col-4" for="grat-number">Want to view and edit past gratitudes?</label>
                    <button class="js-gratitude-btn col-4" type="submit">Get Gratitudes</button>
                </fieldset>
            </form>
            <form class="js-form-post row">
                <fieldset aria-role="group">
                    <legend>Add More Gratitudes</legend>
                    <input type="text" class="col-12" id="js-add-item" placeholder="I am grateful for my dog being so cute." required>
                    <label class="col-4" for="js-add-item">Grateful for anything else?</label>
                    <button class="col-4 js-btn-post" type="submit" ">Add to List</button>
                </fieldset>
            </form>
  
            <div class="js-grat-list grat-list">
            </div>
        </div>
        <footer>
            <button class="js-modal-btn-exit">Exit</button>
        </footer>
    `);
    $('.modal').slideDown('fast');
}

function displayGratitudesList(data) {
    if (data.length === 0) {
        $('.js-grat-list').html(`
        <div class="list-header">
            <h3 class="col-12">Nothing Added yet! Start tracking</h3>
            <button class="js-modal-btn-close">Close</button>
         </div>
        `)
    } else {
        $('.js-grat-list').html(`
            <div class="list-header">
                <h3 class="col-12">Look how great my life is!</h3>
                <button class="js-modal-btn-close">Collapse</button>
            </div>
            <ol class="js-list"></ol>  
        `);
        data.forEach((element, index) => {
            const date = convertDate(element);
            const _id = element._id;
            const gratitude = element.gratitude;
            $('.js-list').append(`
            <li class="" data-index="${index}" data-id="${_id}" data-gratitude="${gratitude}">I am grateful for ${gratitude} <br>${date}
                <div class="row">
                    <button class="js-update-btn col-3">Update</button>
                    <button class="js-delete-btn col-3">Delete</button>
                </div>
            </li>
            <hr>
            `); 
        });  
    }
    $('.js-grat-list').slideDown('fast');
}

function displayNewGratitude(data) {
    $('.js-grat-list').html(`<h4>New gratitude: ${data.gratitude}</h4>`);
}

function displayUpdateOption(gratitude) {
    $('.js-grat-list').html(`
        <form class="js-update-item row">
            <fieldset>
                <legend><strong>${gratitude}</strong></legend>
                <input type="text" class="col-12" id="js-update-item" placeholder="... update gratitude!" required>
                <button class="col-3" type="submit">Update</button>
            </fieldset>
        </form>  
    `);
}

function displayUpdatedGratitude(data) {
    $('.js-grat-list').html(`<h4>Gratitude successfully updated!</h4>`);
}

  //covert the ISO date to human readable Date
function convertDate(gratitude) {
    let date = new Date(gratitude.updatedAt).toString();
    let parsedDate = date.slice(0,15);
return parsedDate;
}

// listener events

// display gratitude modal
$('.js-gratitude-btn').on('click', function() {
    getGratitudes(displayGratitudesModal);
}); 

// exit modal
$('.modal').on('click', '.js-modal-btn-exit', function() {
    $('.modal').slideUp('fast');
}); 

// get and display all gratitudes
$('.modal').on('click', '.js-gratitude-btn', function(event) {
    event.preventDefault();
    getGratitudes(displayGratitudesList);
}); 

// close gratitudes list
$('.modal').on('click', '.js-modal-btn-close', function() {
    $('.js-grat-list').slideUp('fast');
}); 

// POST new gratitude
$('.modal').on('submit', '.js-form-post', function(event) {
    event.preventDefault();
    postGratitudes(displayNewGratitude);
    $('input[id="js-add-item"]').val('');
});

// open update gratitude option
$('.modal').on('click', '.js-update-btn', function() {
    let existingId = $(this).closest('li').attr('data-id');
    let existingGratitude = $(this).closest('li').attr('data-gratitude');
    currentGratitudeId = existingId;
    displayUpdateOption(existingGratitude);
});

// update with PUT request for gratitude and display it
$('.modal').on('submit', '.js-update-item', function(event) {
    event.preventDefault();
    putGratitudes(displayUpdatedGratitude);
}); 

// DELETE gratitude
$('.modal').on('click', '.js-delete-btn', function() {
    gratitudeIdToDelete = $(this).closest('li').attr('data-id');
    deleteGratitudes();
});