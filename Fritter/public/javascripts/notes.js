// Wrapped in an immediately invoked function expression.
(function() {
  $(document).on('click', '#submit-new-note', function(evt) {
      var content = $('#new-note-input').val();
      if (content.trim().length === 0) {
          alert('Input must not be empty');
          return;
      }
      $.post(
          '/notes',
          { content: content }
      ).done(function(response) {
          loadHomePage();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('click', '.delete-note', function(evt) {
      var item = $(this).parent();
      var id = item.data('note-id');
      $.ajax({
          url: '/notes/' + id,
          type: 'DELETE'
      }).done(function(response) {
          item.remove();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });

  $(document).on('click', '.edit-note', function(evt) {
      var item = $(this).parent();
      item.after(Handlebars.templates['edit-note']({
          id: item.data('note-id'),
          existingText: item.find('p').text()
      }));
      item.hide();
  });

  $(document).on('click', '.cancel-button', function(evt) {
      var item = $(this).parent();
      item.prev().show();
      item.remove();
  });

  $(document).on('click', '.submit-button', function(evt) {
      var item = $(this).parent();
      var id = item.data('note-id');
      var content = item.find('input').val();
      if (content.trim().length === 0) {
          alert('Input must not be empty');
          return;
      }
      $.post(
          '/notes/' + id,
          { content: content }
      ).done(function(response) {
          item.after(Handlebars.templates['note']({
              _id: id,
              content: content
          }));
          item.prev().remove();
          item.remove();
      }).fail(function(responseObject) {
          var response = $.parseJSON(responseObject.responseText);
          $('.error').text(response.err);
      });
  });
})();
