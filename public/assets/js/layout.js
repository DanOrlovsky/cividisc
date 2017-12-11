$(document).ready(function() { 
    $.ajax({ 
        url: '/api/notifications',
        method: "GET",
        success: (data) => {
            console.log(data);
        }
    })
})