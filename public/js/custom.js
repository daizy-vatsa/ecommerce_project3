//everytime a user types something
//ajax will immediately notifies the server
//which is pointing at the api url itself, whihc is api/api.js (post request)

//JQUERY

$(function() {

  // keyup is a jquery function where it listens what you types
  //immediately run this function and do ajax

  $('#search').keyup(function() {


    var search_term = $(this).val();

    // ajax call
    $.ajax({
      method: 'POST',
      url: 'api/search',
      data: {
        search_term
      },
      dataType:'json',
      success: function(json) {
        var data = json.hits.hits.map(function(hit) {
          return hit;
        });

// copied from product-main.ejs

        $('#searchResults').empty();
        for (var i =  0; i< data.length; i++) {
            var html = "";
              html += '<div class="col-md-4">';
              html += '<a href="/product/' + data[i]._source._id + '">';
              html += '<div class="thumbnail">';
              html += '<img src="' + data[i]._source.image + '">';
              html += '<div class="caption">';
              html += '<h3>' + data[i]._source.name + '</h3>';
              html +=  '<p>' + data[i]._source.category.name + '</h3>';
              html += '<p>$' + data[i]._source.price + '</p>';
              html += '</div></div></div>';

              $('#searchResults').append(html);
        }
      },

      errot: function(error) {
        console.log(err);
      }
    });
  });








})
