// See handlebarsjs.com for details. Here, we register
// a re-usable fragment of HTML called a "partial" which
// may be inserted somewhere in the DOM using a function
// call instead of manual insertion of an HTML String.
Handlebars.registerPartial('note', Handlebars.templates['note']);
Handlebars.registerPartial('publicNote', Handlebars.templates['publicNote']);
Handlebars.registerPartial('userFollowed', Handlebars.templates['userFollowed']);
Handlebars.registerPartial('userNotFollowed', Handlebars.templates['userNotFollowed']);

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
	data = data || {};
	$('#main-container').html(Handlebars.templates[template](data));
};

var loadHomePage = function() {
	if (currentUser) {
		loadNotesPage();
	} else {
		loadPage('index');
	}
};

var loadNotesPage = function() {
	console.log("loadNotesPage called");
	$.get('/notes', function(response) {
		loadPage('notes', { notes: response.content.notes, currentUser: currentUser });
	});
};

//mine
var loadAllUsersPage = function() {
    console.log("2. public/javascripts/index.js >> loadAllUsersPage function called");
    if(currentUser) {
	$.get('/allusers', function(response) {
		console.log(response);
		loadPage('allUsers', { usersFollowed : response.content.usersFollowed , 
				    usersNotFollowed : response.content.usersNotFollowed ,
				    currentUser: currentUser }); 
	});
    } else {
	loadPage('index');
    }
};

var loadAllNotesPage = function() {
    console.log("2. public/javascripts/index.js >> loadAllNotesPage function called");
    if(currentUser) {
	$.get('/allnotes', function(response) {
		console.log(response);
		loadPage('allNotes', { notes: response.content.notes, currentUser: currentUser }); 
	});
    } else {
	loadPage('index');
    }
};


var loadFollowsNotesPage = function() {
    console.log("2. public/javascripts/index.js >> loadFollowsNotesPage function called");
    if(currentUser) {
	$.get('/followsnotes', function(response) {
		loadPage('allNotes', { notes: response.content.notes, currentUser: currentUser });
	});
    } else {
	loadPage('index');
    }
};

$(document).ready(function() {
	$.get('/users/current', function(response) {
		if (response.content.loggedIn) {
			currentUser = response.content.user;
		}
		loadHomePage();
	});
});

$(document).on('click', '#home-link', function(evt) {
	evt.preventDefault();
	loadHomePage();
});

$(document).on('click', '#signin-btn', function(evt) {
	loadPage('signin');
});

$(document).on('click', '#register-btn', function(evt) {
	loadPage('register');
});

$(document).on('click', '#myfritters-link', function(evt) {
	evt.preventDefault();
	loadHomePage();
});

$(document).on('click', '#allfritters-link', function(evt) {
	evt.preventDefault();
	console.log("1. public/javascripts/index.js >> click allfritters-link");
	loadAllNotesPage();
});

$(document).on('click', '#followersfritters-link', function(evt) {
	evt.preventDefault();
        console.log("1. public/javascripts/index.js >> click followersfritters-link");
	loadFollowsNotesPage();
});

$(document).on('click', '#userstofollow-link', function(evt) {
	evt.preventDefault();
        console.log("1. public/javascripts/index.js >> click userstofollow-link");
	loadAllUsersPage();
});



