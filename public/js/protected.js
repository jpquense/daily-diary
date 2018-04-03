'use strict';

// Check user
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function authorizeUser() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        location.href = '/';
    }
    $.ajax({
        url: 'api/protected',
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: (response) => {
            console.log(response);
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
    authorizeUser();
})

// Logout
$('#js-logout-button').click(event => {
    event.preventDefault();
    logoutUser();
})

function logoutUser() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
}