'use strict';

// Create New Account
$('#js-form-signup').submit(event => {
    event.preventDefault();
    newUser();
})

function newUser() {
    let signup_firstName = $('input[id="js-signup-firstName"]').val();
    let signup_lastName = $('input[id="js-signup-lastName"]').val();
    let signup_username = $('input[id="js-signup-username"]').val();
    let signup_email = $('input[id="js-signup-email"]').val();
    let signup_password = $('input[id="js-signup-password"]').val();
    postNewUser(signup_firstName, signup_lastName, signup_username, signup_email, signup_password);
}

function postNewUser (firstName, lastName, username, email, password) {
    $('.sign-up-failure').remove();
    $.ajax({
        url: '/api/users',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password
        }),
        success: (data) => {
            console.log(data);
            if(data) {
                $('#signup-form').prepend(
                    `<div class='sign-up-success'><span style='vertical-align: middle;'>Hurray! You have successfully signed up! Now you can <a href='/'>login</a>!<span></div>`
                )
            }
        },
        error: (...rest) => {
            $('#signup-form').prepend(
                `
                    <div class='sign-up-failure'>
                        <p>Ohh noo! This email has already been used for signup.</p>
                        <p>Login or try a different email</p>
                    </div>
                `
            )
        }
    })
}

// Login existing user
$('#js-login-form').submit(event => {
    event.preventDefault();
    returningUser();
});

function returningUser(email, password) {
    let login_email = $('input[id="js-login-email"]').val();
    let login_password = $('input[id="js-login-password"]').val();
    postReturningUser(login_email, login_password);
}

function postReturningUser(email, password) {
    $.ajax({
        url:'/api/login',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: (token) => {
            successToken(token);
        },
        error: (jqXHR, exception) => {
            $('.alert').attr('aria-hidden', 'false').removeClass('hidden');
        }
    });
}

function successToken(token) {
    if(token) {
        localStorage.setItem('authToken', token.authToken);
        window.location.href = '/home.html';
    }
}

// Logout
$('#js-logout-button').click(event => {
    console.log('logout btn clicked yea babe!')
    event.preventDefault();
    logoutUser();
})

function logoutUser() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
}

// Check user
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function checkUser() {
    const token = sessionStorage.getItem('token');

    console.log(token);
    
    if(!token) {
        location.href = 'http://localhost:3000/';
    } else {
        $.ajax({
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                console.log(response)
                $('#loader-wrapper').hide();
                const payloadData = parseJwt(token);
                $('#email').text(`Welcome back: ${payloadData.email}`)
            },
            error: () => {
                sessionStorage.removeItem('token');
                location.href = 'http://localhost:3000/';
            }
        })
    }
}

$(function() {
    console.log('check user is listening');
    checkUser();
});