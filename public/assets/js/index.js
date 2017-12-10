(function($) {
    $('.vote-up').on('click', function(e){
        e.preventDefault();
        let id = $(this).attr('data-id');
        let url = '/vote/upvote/' + id;
        console.log(url);
        $.ajax({
            url: url,
            method: "POST",
            success: function(data) {
                $(".upVotes" + id).text(data.upVotes);
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
                $(".downVotes" + id).text(data.downVotes);
            }
        })
    });
})