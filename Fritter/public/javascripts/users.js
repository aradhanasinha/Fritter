// Wrap in an immediately invoked function expression.
(function() {
  $(document).on('submit', '#signin-form', function(evt) {
      evt.preventDefault();
      $.post(
          '/users/login',
          helpers.getFormData(this)
      ).done(function(response) {
          currentUser = response.content.user;
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('submit', '#register-form', function(evt) {
      evt.preventDefault();
      var formData = helpers.getFormData(this);
      if (formData.password !== formData.confirm) {
          $('.error').text('Password and confirmation do not match!');
          return;
      }
      delete formData['confirm'];
      $.post(
          '/users',
          formData
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('click', '#logout-link', function(evt) {
      evt.preventDefault();
      $.post(
          '/users/logout'
      ).done(function(response) {
          currentUser = undefined;
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

//mine
  $(document).on('click', '.changefollowstatus-user', function(evt) {
      console.log("1. public/javascripts/user.js >> click changefollowstatus-user");
      var item = $(this).parent();
      var usernameToChangeFollowStatusFor = item.data("username");
      console.log("2. public/javascripts/user.js >> click changefollowstatus-user >> usernameToChangeFollowStatusFor: " + usernameToChangeFollowStatusFor);
      $.post(
          '/follows',
           {usernameToChangeFollowStatusFor : usernameToChangeFollowStatusFor}
      ).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
      console.log("7. public/javascripts/user.js >> click changefollowstatus-user >> done >> will loadAllUsersPage next");
      loadAllUsersPage();
  });

})();
