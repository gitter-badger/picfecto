$(function(){
    $("#sendEmailAction").click(function() {
        var email = $("#emailValue").val(),
            emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email === "" || email.match(emailRegex) === null)
            return;
        $.ajax({
          type: "POST",
          url: "https://mandrillapp.com/api/1.0/messages/send.json",
          data: {
            'key': 'yQyVVVdmlAJ4TXfUihk4iQ',
            'message': {
              'from_email': 'picfecto.website@gmail.com',
              'to': [
                  {
                    'email': 'picfecto@gmail.com',
                    'name': 'RECIPIENT NAME (OPTIONAL)',
                    'type': 'to'
                  }
                ],
              'autotext': 'true',
              'subject': 'picfecto emails',
              'html': email
            }
          }
        }).done(function(response) {
           $("#emailValue").val(""); 
           console.log(response); // if you're into that sorta thing
        });
    });
})