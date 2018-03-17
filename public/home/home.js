'use strict';

const MOCK_GRATITUDES = {
	"gratitudes": [
        {
            "id": "1111111",
            "gratitude": "I am grateful for my friend taking me out to lunch.",
            "publishedAt": 1470016976609,
            "date": "2017-04-01"
        },
        {
            "id": "222222",
            "gratitude": "I am grateful for my friend taking me out to lunch.",
            "publishedAt": 1470016976609,
            "date": "2017-04-20"
        },
        {
            "id": "333333",
            "gratitude": "I am grateful for my friend taking me out to lunch.",
            "publishedAt": 1470016976609,
            "date": "2017-04-28"
        },
        {
            "id": "4444444",
            "gratitude": "I am grateful for my friend taking me out to lunch.",
            "publishedAt": 1470016976609,
            "date": "2017-04-30"
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementaion will change. Instead of using a
// timeout function that returns mock data, it will 
// use jQuery's AJAX functionality to make a call 
// to the server and then run the callbackFn

// GET client side ajax call
function getGratitudes(callbackFN) {
    $.ajax({
    	url: `https://your-api-url.com/api/posts/${postId}`,
    	method: 'PUT',
      data: {
      	title,
        text,
        author,
      },
      success: () => {
      	console.log('Works!')
      },
      error: () => {
      	console.log('I get an error :/')
      }
    })
}

// POST client side ajax call
function postGratitudes(callbackFN) {
    // we use a `setTimeout` to make this asynchronous
    // as it will be with a real ajax call.
        setTimeout(function() { callbackFN(MOCK_GRATITUDES)}, 100);
}

// PUT client side ajax call
function putGratitudes(callbackFN) {
    // we use a `setTimeout` to make this asynchronous
    // as it will be with a real ajax call.
        setTimeout(function() { callbackFN(MOCK_GRATITUDES)}, 100);
}

// DELETE client side ajax call
function deleteGratitudes(callbackFN) {
    // we use a `setTimeout` to make this asynchronous
    // as it will be with a real ajax call.
        setTimeout(function() { callbackFN(MOCK_GRATITUDES)}, 100);
}

// display functions
function displayGratitudesModal(data) {
    const listLength = data.gratitudes.length;
    const minDate = data.gratitudes[0].date;
    const maxDate = data.gratitudes[data.gratitudes.length - 1].date;
console.log(minDate, maxDate)
    $('.js-modal').html(`
        <header>
        <h2 class="js-modal-header">I am grateful for . . . </h2>
        </header>
        <div class="modal-body">
            <div class="get-all row">
                <h3 class="col-4">Gratitude Count: ${listLength}</h3>
                <button class="js-modal-btn-all" type="submit" ">Get All</button>
            </div>
            <form class="get-some row">
                <fieldset>
                    <legend>By number</legend>
                    <label class="col-4" for="grat-number">How many gratitudes do you want to view?</label>
                    <input class="col-4" type="number" placeholder="1" id="grat-number" min="1" max="${listLength}">
                    <button class="col-4 js-modal-btn-count" type="submit" ">Get Gratitudes</button>
                </fieldset>
                <fieldset>
                    <legend>By date</legend>
                    <label class="col-4" for="grat-date">What days gratidues do you want to view?</label>
                    <input class="col-4" type="date" placeholder="1" id="grat-date" min="${minDate}" max="${maxDate}">
                    <button class="col-4 js-modal-btn-date" type="submit" ">Get Gratitudes</button>
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
    $('.js-grat-list').html(`
        <div class="list-header">
            <h3 class="col-12">Look how great my life is!</h3>
            <button class="js-modal-btn-close">Collapse</button>
        </div>
        <ol class="js-list"></ol>
        <form class="add-items row">
            <label class="col-6 form-control" for="todo-list-item">Grateful for anything else?</label> 
            <button class="add col-3 form-control" type="submit">Add to List</button>
            <input type="text" class="form-input col-12" id="todo-list-item" placeholder="my wife being so kind.">
        </form>        
    `);
    data.gratitudes.forEach((element, index) => {
        const date = element.date;
        const id = element.id;
        const gratitude = element.gratitude
        console.log(date, id, content);
        $('.js-list').append(`
        <li class="" data-index="${index}" data-id="${id}">I am grateful for ${gratitude} <br>${date}
            <div>
                <button class="js-update-btn">Update</button>
                <button>Delete</button>
            </div>
            <div class="js-update-form col-3"></div>
            </li><hr>
        `); 
    });

    $('.js-grat-list').slideDown('fast');
}

function displayUpdateInput() {
    console.log('display updates input ran');
    $('js-update-form').html(`
        <form class="add-items row">
            <input type="text" class="form-control col-6" id="todo-list-item" placeholder="What do you need to do today?">
            <button class="add col-3" type="submit">Add to List</button>
        </form>
    `)
}

// call ajax functions with display call back functions

function getAndDisplayGratitudesModal() {
	getGratitudes(displayGratitudesModal);
}

function getAndDisplayGratitudesList() {
	getGratitudes(displayGratitudesList);
}

function postAndDisplayGratitudes() {
    postGratitudes(displayGratitudesList);
}

// listener events

// display gratitude modal
$('.js-gratitude-btn').click(function() {
    getAndDisplayGratitudesModal();
}); 

// exit modal
$('.modal').on('click', '.js-modal-btn-exit', function() {
    $('.modal').slideUp('fast');
}); 

// get and display all gratitudes
$('.modal').on('click', '.js-modal-btn-all', function() {
    getAndDisplayGratitudesList();
}); 

// close gratitudes list
$('.modal').on('click', '.js-modal-btn-close', function() {
    $('.js-grat-list').slideUp('fast');
}); 

// update gratitude

$('.modal').on('click', '.js-update-grat', function() {
    console.log('Update button is listening');
    displayUpdateInput();
});

$('.modal').on('submit', '', function(event) {
    event.preventDefault();
    console.log('Submit updated item listening event worked');
    postAndDisplayGratitudes();
})