// Wrap in an immediately invoked function expression.
$(function() {

     //home page
    $(document).on("click", "#go-home", function(e) {
        e.preventDefault();
        loadPage();
    });

    // user page
    $(document).on("click", ".note-user", function(e) {
        e.preventDefault();
        var user = $(e.target).attr("user");
        loadUserPage(user);
    });

    // follows page
    $(document).on("click", "#view-follows", function(e) {
        e.preventDefault();
        loadFollowsPage();
    });

    // Follow user handler
    $(document).on("click", "#follow-user", function(e) {
        e.preventDefault();
        var user = $(e.target).attr("user");
        $.post('/users/follow', {username: user}).done(function(response) {
            loadUserPage(user);
        })
    });

});