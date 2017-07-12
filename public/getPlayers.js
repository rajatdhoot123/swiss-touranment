        $(document).ready(function() {

            var getPlayers = function(){
                $.get( "/api/getPlayers/"+$('.tourId').text(), function( data ) {
                  var temp = JSON.parse(data)
                  for (var i = 0 ; i < temp.length ; i ++){
                    $('#playerId').find( "tbody" ).append( '<tr>'+'<td>' + temp[i].player_name  + '</td>'+'</tr>' );
                }
            })
            }

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var currentStatus = function(){
    $.get( "/api/currentStatus/"+$('.tourId').text(), function( data ) {
      var temp = JSON.parse(data)
      alert(temp)
      for (var i = 0 ; i < temp.length ; i ++){
        $('#currentStatus').find( "tbody" ).append( '<tr>'+'<td>' + temp[i].player_name + '</td>'+'<td>' + temp[i].tour_id  + '</td>'+'<td>' + temp[i].Win  + '</td>'+'<td>' + temp[i].loss  + '</td>'+'</tr>' );
    }
})
}
currentStatus();
getPlayers();

console.log($('#addPlay'))
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
        alert("Hi Here is Call")
        $('#playerId').find( "tbody" ).append( '<tr><td>' + formData.pname  + '</td></tr>' );
    });
    event.preventDefault();
});

})
