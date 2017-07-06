var count = 0;


$(document).ready(
    function(){
        $('.login #insidebtn').click(function(){
            var value = $("input[type = 'number']").val();
            var value1 = $("input[type = 'text']").val();
            alert('Player Added Successfully')

            //$("p").html("Hello <b>world</b>!");

            $("p").append("<br> Tournament Id  "+ value +" Player Name  "+ value1+ "</br>");
        });


        $('.start').click(function(){
            count++;
            alert(count +"Round Conducted Successfull")
            window.location.href = "api/getPlayerStandings/"+count;

        });
    }
)
