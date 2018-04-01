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
            localStorage.setItem('authToken', token.authToken);
            location.href = '/home.html';
        },
        error: (jqXHR, exception) => {
            $('.alert').attr('aria-hidden', 'false').removeClass('hidden');
        }
    });
}

  // Show links for authenticated users
//   $(() => {
//     showLinks();
//     let token = localStorage.getItem('authToken');
//     if(token != null) {
//       let userObject = parseJwt(token);
//       $('.greeting').show().append((userObject.user.firstName) + '!');
//     }
//   })

//   function showLinks() {
//     let clientToken = localStorage.getItem('authToken');
//     if (!clientToken) {
//       $('.dashboard_link').hide();
//       $('.logout_button').hide();
//       $('.archive_link').hide();
//       $('.login_link').show();
//       $('#sign_up_form').show();
//     } else {
//       $('.dashboard_link').show();
//       $('.logout_button').show();
//       $('.archive_link').show();
//       $('.login_link').hide();
//       $('#sign_up_form').hide();
//       $('#sign_up_title').css({'margin-right': '0', 'width': '90%'}).append(`<p>Visit your <a href='/dashboard.html'>dashboard</a> to get started.</p>`);
//     }
//   }

