    $(document).ready(function() {
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DISPLAY TOURNAMENT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
       var displayTournament = function(){
        $.get( "/api/sub_tour_count", function( data ) {
          var temp = JSON.parse(data)
          for (var i = 0 ; i < temp.length ; i ++){
            $('#tournamet').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${temp[i].tour_id}/${temp[i].tour_name}" class="torny">${temp[i].tour_name}</a>` + '</td>'+'<td>' + temp[i].status  + '</td>'+'</tr>' );

            }
        })
    }
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<GET ALL PLAYERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DISPLAY USER TOURNAMENT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



    displayTournament();
    $('#usertournament').on('click',function(event) {
        var formData = {
            'tour_name'         : $('input[name=tour_name]').val()
        };


        $.ajax({
            type        : 'POST',
            url         : '/api/usertournament',
            data        : formData,
            dataType    : 'json',
            encode      : true
        })

        .then(function(result) {
            $('.table').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${result.result}/${formData.tour_name}" class="torny">${formData.tour_name}</a>` + '</td>'+'<td>' + 'NOT STARTED' + '</td>'+'</tr>' );
        });
        event.preventDefault();
    });




/*
    $(document).on("click", ".torny", function(event){
        var formData = {
            'tname'       :   $(this).text()
        }

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/torunamentStatus', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })

        .then(function(result) {
            $('.table').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${result.result}/${formData.tour_name}" class="torny">${formData.tour_name}</a>` + '</td>'+'<td>' + 'NOT STARTED' + '</td>'+'</tr>' );
        });
        event.preventDefault();
    });*/





/*    $.get( "/inside_game/:id/:name", function( data ) {
        })*/

});
