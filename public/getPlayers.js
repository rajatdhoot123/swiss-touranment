$(document).ready(function() {

    var getTournamentStatus = function(){
        $.get( "/api/getTournamentStatus/"+$('.tourId').text(), function( data ) {
            var result = JSON.parse(data);
            if(result.length){
                var rnds = result[0].rounds;
                if(result[0].status == 'Finished'){
                    //$('.index1Container').fireworks();
                    $("#rounds td").remove();
                    $('#startButton').html('').addClass('btn-block').append('Winner is ' + result[0].winner_id).prop("disabled" , true);

                    for (var i = 1;i <= rnds ; i++){
                    $('#existingPlayer').attr({'disabled' : 'true'})
                    $('#addPlay').attr({'disabled' : 'true'})
                    $('#rounds').find( "tbody" ).append('<tr>'+'<td>' + [i]  + '</td>'+'<td class="status">' + 'Not Started'  + '</td>' +`<td class="exeround${i}">` + `<button type="button" class="btn btn-info btn-sm str_match" data-toggle="modal" data-target="#myModal2" id="roundbtn${i}" disabled = 'true' value="${i}">Execute Round ${i}</button>`+ '</td>'+'<td>' + `<button type="button" class="btn btn-info btn-sm getStanding" data-toggle="modal" data-target="#myModal3" id="currentFixture" value="${i}">Standing</button>`+ '</td>'+ '</tr>' );
                    $( `.status` ).html('').text('Finished').css( {"z-index": "2","font-weight": "bold","color" : "red"} );
                }
            }
            if(result[0].status == 'InProgress'){
            $( "#startButton" ).trigger('click');
        }
        }
        else{
            $( "#startButton" ).trigger('click');
        }

    })
        /*$('#startButton').trigger('click')*/
    }
getTournamentStatus();


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Players From Other Tournament>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var getPlayers = function(){
    $.get( "/api/getPlayers/"+$('.tourId').text(), function( data ) {
      var totalPlayers = JSON.parse(data)
      $("#playerId td").remove();
      for (var i = 0 ; i < totalPlayers.length ; i++){
        $('#playerId').find( "tbody" ).append( '<tr>'+'<td>' + `<input type="button" class="btn btn-info" id="addExisting" value="${totalPlayers[i].player_name}"></button>` + '</td>'+'</tr>' );
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
var status = $('#getValue')[0].innerText;
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
        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname + '</td>'+'<td>' + 0  + '</td>'+'<td>' + 0  + '</td>'+'</tr>' );
        $('#getCurrentPlayers').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname  + '</td>'+'</tr>' );
        currentStatus();
        $('#addExisting').notify("Player Added","success");

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
        $('.addPlayInput').val('');
        if(result === 0){
          $('.addPlay').notify("Player Already Exist","error");
            //alert("Player Already Exist")
        }
        else{
        $('.addPlay').notify("Player Added Successfully","success");
        $('#getCurrentPlayers').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname  + '</td>'+'</tr>' );

        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname + '</td>'+'<td>' + 0  + '</td>'+'<td>' + 0  + '</td>'+'</tr>' );
    }
    });
    event.preventDefault();
});



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
currentStatus();
getPlayers();
getCurrentPlayers();
var rounds = 0;


/*var status = $('#getValue')[0].innerText;
if(status == 'Status NOTSTARTED'){
    alert('Play Match')
}
else{
    $('#startButton').attr({'disabled' : 'true'})
    var winner = $('#currentStatus').find('tbody').children('tr:first-child').children('td:first-child').text()
    alert(winner)
}*/



$( document ).on( "click", "#addExisting" ,function() {
    $( this ).parent().remove()
});



$(document).on("click", ".str_match", function(event){
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
        console.log(result)
        for (var i = 0;i < result.length ; i++){
            $('#fixtureB').find( "tbody" ).append('<tr>'+'<td>' + `<input type="radio" name="pname${i}"
                value="${result[i].player_name}" checked id="${formData.round}">`
                +'</td>'+'<td>'+ result[i++].player_name +'</td>' +'<td>'+
                `<input type="radio" name="pname${i-1}" value="${result[i].player_name}"
                id="${formData.round}">` +'</td>'+ '<td>' + result[i].player_name  + '</td>' + '</tr>');

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

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var updateTour = function(){


var formData = {
        'tourId'        : $('.tourId').text()
    };
    $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/api/tournamentOver', // the url where we want to POST
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
}
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$('.str_match').on('click',function(event) {
    matchRoundFunction();

})


var matchRoundFunction = function(){

   $.get( "/api/getTotalPlayers/"+$('.tourId').text(), function( data ) {

      var tplayers = JSON.parse(data)
      rounds = Math.log2(tplayers.length)
      if(Number.isInteger(Math.log2(tplayers.length) || rounds == 0)){
        $('#startBody').text('You Can Start Match Now')
        $('#addPlay').attr({'disabled' : 'true'})
        $('#existingPlayer').attr({'disabled' : 'true'})
        $("#rounds td").remove();
        for (var i = 1;i <= rounds ; i++){
           if(i === 1){
            $('#rounds').find( "tbody" ).append('<tr>'+'<td>' + [i]  + '</td>'+'<td class="status">' + 'Not Started'  + '</td>' +`<td class="exeround${i}">` + `<button type="button" class="btn btn-info btn-sm str_match" data-toggle="modal" data-target="#myModal2" id="roundbtn${i}" value="${i}">Execute Round ${i}</button>`+ '</td>'+'<td>' + `<button type="button" class="btn btn-info btn-sm getStanding btnfix${i}" data-toggle="modal" data-target="#myModal3" disabled="true" id="currentFixture" value="${i}">Standing</button>`+ '</td>'+ '</tr>' );
        }
        else{
            $('#rounds').find( "tbody" ).append('<tr>'+'<td>' + [i]  + '</td>'+'<td class="status">' + 'Not Started'  + '</td>' +`<td class="exeround${i}">` + `<button type="button" class="btn btn-info btn-sm str_match" data-toggle="modal" data-target="#myModal2" id="roundbtn${i}" disabled = 'true' value="${i}">Execute Round ${i}</button>`+ '</td>'+'<td>' + `<button type="button" class="btn btn-info btn-sm getStanding btnfix${i}" data-toggle="modal" data-target="#myModal3"  disabled="true"  id="currentFixture" value="${i}">Standing</button>`+ '</td>'+ '</tr>' );
        }
    }
}
else{
    $('#startBody').text('You Can Not Start Match Now Add Player 2 Power Of N to Start Match')
}
}).then(function(){
    $.ajax({
        url:"/api/getRounds/"+$('.tourId').text(),success: function(data){

            $.each(data,function(i,elem){
                var rnd1 = "" + (i+1);
                var roundName = '#roundbtn'.concat(rnd1)
                if($(roundName).val() == elem.round_id){
                    $(roundName).attr({'disabled' : 'true'})
                    $(`#roundbtn${i+2}`).prop("disabled" , false)
                    $(`.btnfix${i+1}`).prop("disabled" , false)
                    $(roundName).html('')
                    $(roundName).append('Round Played')
                    $( roundName ).css( "background-color", "red" );
                    $('#existingPlayer').attr({'disabled' : 'true'})
                    $('#addPlay').attr({'disabled' : 'true'})
                    $( `td.exeround${i+1}` ).prev().html('').text('Finished').css( {"z-index": "2","font-weight": "bold","color" : "red"} );
                    if(($(`#roundbtn${i+1}`).val()) == rounds){
                        $('#startButton').attr({'disabled' : 'true'})
                        $('#startButton').addClass(" btn btn-block")
                        /*$('#addPlay').attr({'disabled' : 'true'})
                        $('#existingPlayer').attr({'disabled' : 'true'})*/
                        currentStatus();
                        var winner = $('#currentStatus').find('tbody').children('tr:first-child').children('td:first-child').text()
                        $('#startButton').html('').append('Winner is :'+ winner);
                        $('#startBody').text('Touranament Over, Winner is  ' + winner);
                        $('#getValue').text('Status Finished and Winner' + winner)
                        status = 'Finished'
                        updateTour();
                        getTournamentStatus();
                        /*var pathname = window.location.pathname;
                        var array = pathname.split('/');
                        array.pop();
                        array.push('finished')
                        var url = array.join('/')
                        window.location.href = url;
                        console.log(url)*/
                    }
                }
            })
        }
    })
})
}
























//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=
})
