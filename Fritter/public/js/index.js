// See handlebarsjs.com for details. Here, we register
// a re-usable fragment of HTML called a "partial" which
// may be inserted somewhere in the DOM using a function
// call instead of manual insertion of an HTML String.
Handlebars.registerPartial('home', Handlebars.templates['home']);
Handlebars.registerPartial('header', Handlebars.templates['header']);
Handlebars.registerPartial('login', Handlebars.templates['login']);

// Global variable set when a user is logged in. Note
// that this is unsafe on its own to determine this: we 
// must still verify every server request. This is just 
// for convenience across all client-side code.
currentUser = undefined;

// A few global convenience methods for rendering HTML
// on the client. Note that the loadPage methods below
// fills the main container div with some specified 
// template based on the relevant action.

var loadPage = function(template, data) {
	data = data || {currentUser: currentUser};
    if (!currentUser) {
        data.notLoggedIn = true;
        $('#container').html(Handlebars.templates["home"](data));
        $('#header').html(Handlebars.templates["header"]({currentUser: currentUser}));
    } else {
        data.notLoggedIn = false;
        $.get('/notes', function(response) {
            (response.content).forEach(function(f) {
                f.ts = moment(f.ts).fromNow();
                if (currentUser === f.author) {
                    f["ownership"] = true;
                }
            });
            data.notes = response.content.reverse();
            $('#container').html(Handlebars.templates["home"](data));
            $('#header').html(Handlebars.templates["header"]({currentUser: currentUser}));
        });
    }
};

//user page
var loadUserPage = function(username) {
    var data = {user: username};
    $.get('/notes/filter', {authors: [username]}, function(response) {
        data.notes = response.content.reverse();
        data.notes.forEach(function(f) {
            f.ts = moment(f.ts).fromNow();
            if (currentUser === f.author) {
                f["ownership"] = true;
            }
        });
        $.get('/users/follows', {username: username}, function(response) {
            data.follows = response.content.result;
            $.get('/users/follows', {username: currentUser}, function(response) {
                data.canFollow = username !== currentUser && response.content.result.indexOf(username) === -1;
                console.log(data);
                $('#container').html(Handlebars.templates["home"](data));
            });
        })
    });
}

//follows page
var loadFollowsPage = function() {
    var data = {filteredView: true};
    $.get('/users/follows', {username: currentUser}, function(response) {
        var follows = response.content.result;
        $.get('/notes/filter', {authors: follows}, function(response) {
            data.notes = response.content.reverse();
            data.notes.forEach(function(f) {
                f.ts = moment(f.ts).fromNow();
                if (currentUser === f.author) {
                    f["ownership"] = true;
                }
            });
            console.log(data);
            $('#container').html(Handlebars.templates["home"](data));
        })
    });
}

// home page
$(function() {
    $.get('/users/current', function(response) {
        if (response.content.loggedIn) {
            currentUser = response.content.user;
        } else {
            currentUser = undefined;
        }
        loadPage({currentUser: currentUser});
    });
});