$(document).ready(

    function(){
        $('button[type = submit]').click(function(){
            var value = $("input[type = 'number']").val();
            var value1 = $("input[type = 'text']").val();
            alert("Player Added");

            //$("p").html("Hello <b>world</b>!");

            $("p").append("<br> Tournament Id  "+ value +" Player Name  "+ value1+ "</br>");
        });
    }
)