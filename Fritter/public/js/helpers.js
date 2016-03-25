// Packaged helper methods.
//
// Here, just one which takes the content of an HTML 
// form (passed in as an argument) and converts the 
// data to a set of key-value pairs for use in AJAX 
// calls.
var helpers = (function() {

	var _helpers = {};

	//get data from form
	_helpers.getFormData = function(form) {
		var inputs = {};
		$(form).serializeArray().forEach(function(item) {
			inputs[item.name] = item.value;
		});
		return inputs;
	};

	// Display an err message as error box
    _helpers.displayError = function(id,msg) {
        $(id).text(msg);
    }

    // Hide the login/register popup
    _helpers.hidePopup = function() {
        $("#popup").css("display", "none");
        $("#cover").css("display", "none");
    }

    // Show the login popup
    _helpers.showPopup = function() {
        $("#popup").css("display", "block");
        $("#cover").css("display", "block");
    }
    
	Object.freeze(_helpers);
	return _helpers;

})();
