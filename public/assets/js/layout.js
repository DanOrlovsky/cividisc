

$(function() {
    var displayNotify;
    var count = 0;
    function displayNotification(msg) {
        $("#notification-bar").animate({ opacity: 1, "z-index": 100 }, 200);
        $("#notify-bar").text(msg);
        count = 0;
        displayNotify = setInterval(countDown, 500);

    }
    function countDown() {
        count++;
        if(count > 5) {
            $("#notification-bar").animate({opacity: 0, "z-index": -100 }, 200);
            clearInterval(displayNotify);
        }
    }

    $('.vote-up').on('click', function(e){
        e.preventDefault();
        
        let id = $(this).attr('data-id');
        let url = '/vote/upvote/' + id;
        //console.log(url);
        $.ajax({
            url: url,
            method: "PUT",
            success: function(data) {
                $(".upvotes" + id).text(data.upVotes);
                displayNotification(data.message);
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
                displayNotification(data.message);
            }
        })
    });
    $('textarea.reply').focus(function () {
        $(this).animate({ height: "6em", width: '100%' }, 200);
    });
    $(".replyBtn").on("click", function() {
        let replyId = parseInt($(this).attr('data-id'));
        let comment = $("textarea#replyTo" + replyId).val();
        let url = '/posts/reply/' + replyId;
        $.ajax({
            url: url,
            method: "POST",
            data: { comment: comment },
            success: function(data) {
                window.location = '/post/view/' + data.newPostId;
            }
        })
    })
    $("#submit-now").on('click', function(e) {
        var msgString = "";
        var failed = false;
        if($("#topicId").val() == -1) {
            msgString += "Please select a topic.\n";
            failed = true;
        }
        if($("#title").val() == "") {
            msgString += "Please enter a title\n";
            failed = true;
        }
        if(failed){
            e.preventDefault();
            displayNotification(msgString);
        }
        //alert($("#topicId").val());
    })
})