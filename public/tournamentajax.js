    $(document).ready(function() {
       var displayTournament = function(){
        $.get( "/api/sub_tour_count", function( data ) {
          var temp = JSON.parse(data)
          for (var i = 0 ; i < temp.length ; i ++){
            $('.table').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${temp[i].tour_id}/${temp[i].tour_name}">${temp[i].tour_name}</a>` + '</td>'+'<td>' + temp[i].status  + '</td>'+'</tr>' );

                  /*$('.viewtournament').append( '<tr><td>' + temp[i].tour_id  + '</td></tr>' );
                  $('.viewtournament').append( '<tr><td>' + temp[i].tour_name  + '</td></tr>' );*/
            }
        })
    }

    displayTournament();
    $('#usertournament').on('click',function(event) {
        var formData = {
            'tour_name'         : $('input[name=tour_name]').val()
        };


        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/usertournament', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })

        .then(function(result) {
            alert(JSON.parse(result.result))
            $('.table').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${result.result}/${formData.tour_name}">${formData.tour_name}</a>` + '</td>'+'<td>' + 'NOT STARTED' + '</td>'+'</tr>' );
        });
        event.preventDefault();
    });



    $.get( "/inside_game/:id/:name", function( data ) {
          alert(req.params.id + "++++++++++++" + req.params.name)
        })





});
