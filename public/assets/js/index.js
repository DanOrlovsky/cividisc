$(function() {
    $('.vote-up').on('click', function(e){
        e.preventDefault();
        alert("Here we are!");
        let id = $(this).attr('data-id');
        let url = '/vote/upvote/' + id;
        console.log(url);
        $.ajax({
            url: url,
            method: "POST",
            success: function(data) {
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
            method: "POST",
            success: function(data) {
                $(".downvotes" + id).text(data.downVotes);
            }
        })
    });
})