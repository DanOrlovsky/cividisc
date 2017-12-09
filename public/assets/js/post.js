$('.upvote').on('click', function(e) {
    e.preventDefault();
    var url = '/vote/upvote/' + $(this).attr('data-id');
    console.log(url);
    $.ajax({
        url: url,
        method: "POST",
        success: function() {
            alert("Hooray!");
        }
    })
})