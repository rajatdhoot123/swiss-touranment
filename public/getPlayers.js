var rounds = 0;


$(document).ready(function() {

    var getPlayers = function(){
        $.get( "/api/getPlayers/"+$('.tourId').text(), function( data ) {
          var totalPlayers = JSON.parse(data)
          for (var i = 0 ; i < totalPlayers.length ; i ++){
            $('#playerId').find( "tbody" ).append( '<tr>'+'<td>' + `<a href="/inside_game/${totalPlayers[i].tour_id}/${totalPlayers[i].player_name}">${totalPlayers[i].player_name}</a>` + '</td>'+'</tr>' );
        }
    })
    }


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>CURRENT STATUS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var currentStatus = function(){
    $.get( "/api/currentStatus/"+$('.tourId').text(), function( data ) {
       var currentPlayers = JSON.parse(data)
      for (var i = 0 ; i < currentPlayers.length ; i ++){
        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + currentPlayers[i].player_name + '</td>'+'<td>' + currentPlayers[i].tour_id  + '</td>'+'<td>' + currentPlayers[i].Win  + '</td>'+'<td>' + currentPlayers[i].loss  + '</td>'+'</tr>' );
    }
})
}


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
        $('#playerId').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname  + '</td>'+'</tr>' );
        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + formData.pname + '</td>'+'<td>' + formData.tourId  + '</td>'+'<td>' + 0  + '</td>'+'<td>' + 0  + '</td>'+'</tr>' );
    });
    event.preventDefault();
});








//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
currentStatus();
getPlayers();


$(document).on("click", "#roundbtn", function(event){
//$('.str_match').on('click','#roundbtn',function(event) {
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
        for (var i = 0;i < result.length ; i++){
            alert(result[i].player_name)
            $('#fixtureB').find( "tbody" ).append('<tr>'+'<td>' + `<input type="radio" name="pname${i}" value="${result[i].player_name}">`+'</td>'+'<td>'+ result[i++].player_name +'</td>' +'<td>'+ `<input type="radio" name="pname${i-1}" value="${result[i].player_name}" >` +'</td>'+ '<td>' + result[i].player_name  + '</td>' + '</tr>');
        }
    });
    event.preventDefault();
});



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


$(document).on("click", "#radioHandle", function(event){
    var winner = [];
    var loser = []
    $(':radio').each(function(){
        if($(this).is(':checked')){
            winner.push($(this).val());
        }
        else{
            loser.push($(this).val());
        }
    });




        var formData = {
        'winner'         : winner,
        'loser'          : loser,
        'tourId'        : $('.tourId').text()
    };
    $.ajax({
        type        : 'post',
        url         : `/api/updateMatch/`,
        data        : formData,
        dataType    : 'json',
        encode      : true
    })
    .then(function(result) {
        alert('in then')
    })

    event.preventDefault();
})









//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$('.str_match').on('click',function(event) {

   $.get( "/api/getTotalPlayers/"+$('.tourId').text(), function( data ) {

      var tplayers = JSON.parse(data)
      rounds = Math.log2(tplayers.length)
      if(Number.isInteger(Math.log2(tplayers.length))){
        $('#startBody').text('You Can Start Match Now')
        for (var i = 1;i <= rounds ; i++){
            $('#rounds').find( "tbody" ).append('<tr>'+'<td>' + [i]  + '</td>'+'<td>' + 'status'  + '</td>' +'<td>' + `<button type="button" class="btn btn-info btn-sm str_match" data-toggle="modal" data-target="#myModal2" id="roundbtn" value="${i}">Execute Round ${i}</button>`+ '</td>'+'<td>' + `<a href="Link">Name</a>`+ '</td>'+ '</tr>' );
        }
    }
    else{
        $('#startBody').text('You Can Not Start Match Now')
    }
})
})




})
