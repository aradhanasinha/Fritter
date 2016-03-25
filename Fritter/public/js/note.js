// Wrapped in an immediately invoked function expression.
(function() {
    // Add new note
    $(document).on("click", "#note-button", function(e) {
        e.preventDefault();
        var note = $("#note-input").val();
        $.post(
            '/notes/add',
            { note: note }
        ).done(function(response) {
            loadPage();
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#note-error",response.err);
        });
    });

    // ReTweet
    $(document).on("click", ".rf-button", function(e) {
        var id = $(e.target).attr("note");
        $.post(
            '/notes/rf',
            { noteId: id }
        ).done(function(response) {
            loadPage();
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#note-error",response.err);
        });
    });

    // Delete 
    $(document).on("click", ".delete-button", function(e) {
        var id = $(e.target).attr("note");
        $.post(
            '/notes/delete',
            { noteId: id }
        ).done(function(response) {
            loadPage();
        }).fail(function(responseObject) {
            var response = $.parseJSON(responseObject.responseText);
            helpers.displayError("#note-error",response.err);
        });
    });
})();
