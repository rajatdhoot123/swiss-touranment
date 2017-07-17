$(document).ready(function() {


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Players From Other Tournament>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var getPlayers = function(){
        $.get( "/api/getPlayers/"+$('.tourId').text(), function( data ) {
          var totalPlayers = JSON.parse(data)
          $("#playerId td").remove();
          for (var i = 0 ; i < totalPlayers.length ; i ++){
            $('#playerId').find( "tbody" ).append( '<tr>'+'<td>' + `<input type="button" class="btn btn-info" id="addExisting" name="${totalPlayers[i].tour_id}" value="${totalPlayers[i].player_name}"></button>` + '</td>'+'</tr>' );
        }
    })
    }


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var getCurrentPlayers = function(){
    $.get( "/api/getCurrentPlayers/"+$('.tourId').text(), function( data ) {
      var currentPlayers = JSON.parse(data)
      $("#getCurrentPlayers td").remove();
      for (var i = 0 ; i < currentPlayers.length ; i ++){
        $('#getCurrentPlayers').find( "tbody" ).append( '<tr>'+'<td>' + `${currentPlayers[i].player_name}` + '</td>'+'</tr>' );
    }
})
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>CURRENT STATUS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var currentStatus = function(){
    $.get( "/api/currentStatus/"+$('.tourId').text(), function( data ) {
       var currentPlayers = JSON.parse(data)
       $("#currentStatus td").remove();
       for (var i = 0 ; i < currentPlayers.length ; i ++){
        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td class="winner">' + currentPlayers[i].player_name + '</td>'+'<td>'  + currentPlayers[i].wins  + '</td>'+'<td>' + currentPlayers[i].losses  + '</td>'+'</tr>' );
    }
})
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


var getRoundFixture = function(){
    $.get( "/api/getRoundFixture"+$('.tourId').text(), function( data ) {
       var currentPlayers = JSON.parse(data)
       $("#currentStatus td").remove();
       for (var i = 0 ; i < currentPlayers.length ; i ++){
        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + currentPlayers[i].player_name + '</td>'+'<td>' + currentPlayers[i].tour_id  + '</td>'+'<td>' + currentPlayers[i].Win  + '</td>'+'<td>' + currentPlayers[i].loss  + '</td>'+'</tr>' );
    }
})
}




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


$(document).on("click", "#addExisting", function(event){
    alert(($('.tourId').text()))
    var formData = {
        'pname'         : $(this).val(),
        'tourId'        : $('.tourId').text()
    };

    $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/registerPlayers', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })

    .then(function(result) {
        /*$('#playerId').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname  + '</td>'+'</tr>' );*/

        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname + '</td>'+'<td>' + 0  + '</td>'+'<td>' + 0  + '</td>'+'</tr>' );
    });
    event.preventDefault();
});




//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

$('#addPlay').on('click',function(event) {
    var formData = {
        'pname'         : $('input[name=pname]').val(),
        'tourId'        : $('.tourId').text()
    };

    $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/registerPlayers', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })

    .then(function(result) {
        $('#getCurrentPlayers').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname  + '</td>'+'</tr>' );

        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname + '</td>'+'<td>' + 0  + '</td>'+'<td>' + 0  + '</td>'+'</tr>' );
    });
    event.preventDefault();
});



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
currentStatus();
getPlayers();
var rounds = 0;
getCurrentPlayers();


$(document).on("click", ".str_match", function(event){
    //$(this).attr("disabled", true);
    var formData = {
        'round'         : $(this).attr("value"),
        'tourId'        : $('.tourId').text()
    };
    $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/getFixture', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
            encode      : true
        })

    .then(function(result) {
        $("#fixtureB td").remove();
        for (var i = 0;i < result.length ; i++){
            $('#fixtureB').find( "tbody" ).append('<tr>'+'<td>' + `<input type="radio" name="pname${i}" value="${result[i].player_name}" id="${formData.round}">`+'</td>'+'<td>'+ result[i++].player_name +'</td>' +'<td>'+ `<input type="radio" name="pname${i-1}" value="${result[i].player_name}" id="${formData.round}">` +'</td>'+ '<td>' + result[i].player_name  + '</td>' + '</tr>');
        }
    });
    event.preventDefault();
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(document).on("click", "#radioHandle", function(event){

    matchRoundFunction();
    var winner = [];
    var loser = [];
    var tourId = [];
    var round = [];
    $(':radio').each(function(){
        if($(this).is(':checked')){
            winner.push($(this).val());
            round.push(($(this).attr('id')))
        }
        else{
            loser.push($(this).val());
            tourId.push($('.tourId').text());
        }
    });
    var formData = {
        'winner'         : winner,
        'loser'          : loser,
        'tourId'        : tourId,
        'round'         : round,
    };
    $.ajax({
        type        : 'post',
        url         : `/api/updateMatch/`,
        data        : formData,
        dataType    : 'json',
        encode      : true
    })
    .then(function(result) {
        currentStatus();
    })

    event.preventDefault();
})


$(document).on("click", ".getStanding", function(event){
    round = $(this).attr('value');
    getRoundFixture();
});


var getRoundFixture = function(){
    $.get( "/api/getRoundFixture/"+$('.tourId').text()+'/'+round, function( data ) {
     var result = JSON.parse(data)
     $("#currentFixtureBody td").remove();
     for (var i = 0; i < result.length;i++){
         $('#currentFixtureBody').find( "tbody" ).append('<tr>'+'<td>'+ result[i].winner_id +'</td>' + '<td>' + result[i].loser_id  + '</td>' + '</tr>');
     }
 })
}



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$('.str_match').on('click',function(event) {
    matchRoundFunction();

})


var matchRoundFunction = function(){

   $.get( "/api/getTotalPlayers/"+$('.tourId').text(), function( data ) {

      var tplayers = JSON.parse(data)
      rounds = Math.log2(tplayers.length)
      if(Number.isInteger(Math.log2(tplayers.length))){
        $('#startBody').text('You Can Start Match Now')
        $("#rounds td").remove();
        for (var i = 1;i <= rounds ; i++){
            $('#rounds').find( "tbody" ).append('<tr>'+'<td>' + [i]  + '</td>'+'<td class="status">' + 'status'  + '</td>' +`<td class="exeround${i}">` + `<button type="button" class="btn btn-info btn-sm str_match" data-toggle="modal" data-target="#myModal2" id="roundbtn${i}" value="${i}">Execute Round ${i}</button>`+ '</td>'+'<td>' + `<button type="button" class="btn btn-info btn-sm getStanding" data-toggle="modal" data-target="#myModal3" id="currentFixture" value="${i}">Standing</button>`+ '</td>'+ '</tr>' );
        }
    }
    else{
        $('#startBody').text('You Can Not Start Match Now Add Player 2 Power Of N to Start Match')
    }
}).then(function(){
    $.ajax({
        url:"/api/getRounds/"+$('.tourId').text(),success: function(data){

            $.each(data,function(i,elem){
                var temp1 = "" + (i+1);
                var temp2 = '#roundbtn'.concat(temp1)
                if($(temp2).val() == elem.round_id){
                    $(temp2).attr({'disabled' : 'true'})
                    $(temp2).html('')
                    $(temp2).append('Round Played')
                    $( temp2 ).css( "background-color", "red" );
                    $( `td.exeround${i+1}` ).prev().html('').text('Finished').css( {"z-index": "2","font-weight": "bold","color" : "red"} );
                    if(($(`#roundbtn${i+1}`).val()) == rounds){
                        $('#startButton').attr({'disabled' : 'true'})
                        var winner = $('#currentStatus').find('tbody').children('tr:first-child').children('td:first-child').text()
                        $('#startButton').html('').append('Winner is :'+ winner);
                         $('#startBody').text('Touranament Over, Winner is  ' + winner)
                         $('#startButton').addClass(" btn btn-block")
                         $('#addPlay').attr({'disabled' : 'true'})
                    }
                }
            })
        }
    })
})
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
})
