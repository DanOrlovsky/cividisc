$(document).ready(function() { 
    $.ajax({ 
        url: '/api/notifications',
        method: "GET",
        success: (data) => {
            console.log(data);
        }
    })
})

$(function() {
    $('.vote-up').on('click', function(e){
        e.preventDefault();
        
        let id = $(this).attr('data-id');
        let url = '/vote/upvote/' + id;
        $.ajax({
            url: url,
            method: "PUT",
            success: function(data) {
                console.log(data);
                $(".upvotes" + id).text(data.upVotes);
            }
        })
    });
    $('.vote-down').on('click', function(e){
        e.preventDefault();
        let id = $(this).attr('data-id');
        let url = '/vote/downvote/' + id;
        console.log(url);
        $.ajax({
            url: url,
            method: "PUT",
            success: function(data) {
                $(".downvotes" + id).text(data.downVotes);
            }
        })
    });
})