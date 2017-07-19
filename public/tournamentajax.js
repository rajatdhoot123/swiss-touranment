    $(document).ready(function() {

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<DISPLAY TOURNAMENT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
       var displayTournament = function(){
        $.get( "/api/sub_tour_count", function( data ) {
          var temp = JSON.parse(data)
          for (var i = 0 ; i < temp.length ; i ++){
            $('#tournamet').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${temp[i].tour_id}/${temp[i].tour_name}/${temp[i].status}" class="torny">${temp[i].tour_name}</a>` + '</td>'+'<td>' + temp[i].status  + '</td>'+'</tr>' );

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
            $('#tour_name').val('');
            if(result){
            $('.table').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${result.result}/${formData.tour_name}/NOTSTARTED" class="torny">${formData.tour_name}</a>` + '</td>'+'<td>' + 'NOT STARTED' + '</td>'+'</tr>' );
            $('#usertournament').notify("Tournament Added","success");
        }
        else{
            $('#usertournament').notify("Tournament Already Exist","error");
        }

        });
        event.preventDefault();
    });
});
