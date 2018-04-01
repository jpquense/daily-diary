'use strict';

// Check user
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function authorizeUser() {
    console.log('authorizeUser ran!');
    const token = localStorage.getItem('authToken');
    if (!token) {
        location.href = '/';
    }
    $.ajax({
        url: 'api/info',
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: (response) => {
            console.log(response, token)
            $('#js-loader-wrapper').hide();
            const payloadData = parseJwt(token);
            
        },
        error: function() {
            localStorage.removeItem('authToken');
            location.href = '/';
        }
    })
}

$(() => {
    console.log('protected api fired!')
    authorizeUser();
})

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