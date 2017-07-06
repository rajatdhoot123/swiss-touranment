$(document).ready(

    function(){
        $('button[type = submit]').click(function(){
            var value = $("input[type = 'number']").val();
            $('p').innerTextHtml = value;
        })
    }
)
