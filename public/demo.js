var count = 1;

$(document).ready(
    function(){
        $('.login #insidebtn').click(function(){
            var value = $("input[type = 'number']").val();
            var value1 = $("input[type = 'text']").val();
            alert('Player Added Successfully')

            //$("p").html("Hello <b>world</b>!");

            $("p").append("<br> Tournament Id  "+ value +" Player Name  "+ value1+ "</br>");
        });

        $( ".total" ).click(function() {
            var temp = $(this).attr("name")
            var x = Math.log2(temp)
            if(Number.isInteger(x) && count <= x){
                $( "#round" ).attr( "value", `${count}` );
                $( "#sub" ).submit();
                count++;
            }
            else{
                alert("Please Add Player in 2^n to Start Match");
            }
        })
    }
    )
