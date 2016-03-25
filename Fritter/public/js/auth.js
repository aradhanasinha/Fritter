$(function() {

    // Show login popup
    $(document).on("click", "#show-login", function(e) {
        e.preventDefault();
        helpers.showPopup();
        $('#popup').html(Handlebars.templates["login"]({register: false}));
    });

    // Show register popup
    $(document).on("click", "#show-register", function(e) {
        e.preventDefault();
        helpers.showPopup();
        $('#popup').html(Handlebars.templates["login"]({register: true}));
    });

    // Hide popup
    $(document).on("click", "#close-popup", function(e) {
        e.preventDefault();
        helpers.hidePopup();
    });

    // Log in AJAX request
    $(document).on("click", "#login-button", function(e) {
        e.preventDefault();
        var username = $("#login-form input[name=username]").val();
        var password = $("#login-form input[name=password]").val();
        $.post(
            '/users/login',
            { username: username, password: password }
        ).done(function(response) {
            currentUser = response.content.user;
            helpers.hidePopup();
            loadPage({currentUser: currentUser});
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#login-error",response.err);
        });
    });

    // Register AJAX request
    $(document).on("click", "#register-button", function(e) {
        e.preventDefault();
        var username = $("#register-form input[name=username]").val();
        var password = $("#register-form input[name=password]").val();
        $.post(
            '/users/create',
            { username: username, password: password }
        ).done(function(response) {
            currentUser = response.content.user;
            helpers.hidePopup();
            loadPage({currentUser: currentUser});
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#login-error",response.err);
        });
    });

    // Log out
    $(document).on("click", "#logout-button", function(e) {
        e.preventDefault();
        currentUser = undefined;
        $.post(
            '/users/logout'
        ).done(function(response) {
            currentUser = undefined;
            loadPage({currentUser: currentUser});
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#login-error",response.err);
        }); 
    });
});